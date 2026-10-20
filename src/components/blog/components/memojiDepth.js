// Turns the flat memoji into a head that turns in 3D, the way Facebook's 3D
// photos do: a depth map (src/assets/memoji-depth.png, made once offline with
// Depth Anything V2) says how near each pixel is, and a WebGL shader shifts
// pixels toward the gaze by how near they are: the nose most, the ears least,
// the backdrop not at all. The head leans toward the pointer and turns as it
// goes. The head's depth runs a few px past its outline, so the stretched
// pixels land in the plain blue backdrop, not on the hair.

// Shift at full gaze for a depth difference of 1, as a fraction of the image.
export const DEPTH_STRENGTH = 0.05;
// Up and down turns are smaller than sideways ones.
export const DEPTH_STRENGTH_Y = 0.7;
// Depth (0 far to 1 near) that stays still: the backdrop, which would
// otherwise show the image's edge at the frame.
export const DEPTH_FOCUS = 0;
// Depth of the eye openings in the depth map, so the DOM eye layers can move
// with the face drawn under them.
export const EYE_DEPTH = 0.91;

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// For each output pixel, find the source pixel that lands on it. The shift
// depends on the source's own depth, so a few fixed-point steps settle it.
const FRAGMENT = `
precision mediump float;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uShift;
uniform float uFocus;
varying vec2 vUv;
void main() {
  vec2 src = vUv;
  for (int i = 0; i < 5; i++) {
    src = vUv - uShift * (texture2D(uDepth, src).r - uFocus);
  }
  gl_FragColor = texture2D(uImage, src);
}`;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function texture(gl, unit, img) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

// Returns { ready, draw(x, y), destroy() }, or null without WebGL. x and y
// are the gaze, -1 to 1, with +y pointing down the screen. draw() before
// ready resolves does nothing.
export function createMemojiDepth(canvas, imageSrc, depthSrc) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) return null;

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uShift = gl.getUniformLocation(program, 'uShift');
  gl.uniform1f(gl.getUniformLocation(program, 'uFocus'), DEPTH_FOCUS);
  gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0);
  gl.uniform1i(gl.getUniformLocation(program, 'uDepth'), 1);

  let loaded = false;
  const ready = Promise.all([loadImage(imageSrc), loadImage(depthSrc)]).then(([img, depth]) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    texture(gl, 0, img);
    texture(gl, 1, depth);
    loaded = true;
  });

  const draw = (x, y) => {
    if (!loaded) return;
    // The memoji's size changes with the breakpoint; match the backing store.
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    // GL's v axis points up, the gaze's y points down.
    gl.uniform2f(uShift, x * DEPTH_STRENGTH, -y * DEPTH_STRENGTH * DEPTH_STRENGTH_Y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  // Leaves the context alive: a canvas hands back the same context, lost or
  // not, and React's dev double-run of effects would get a dead one.
  const destroy = () => {
    loaded = false;
  };

  return { ready, draw, destroy };
}
