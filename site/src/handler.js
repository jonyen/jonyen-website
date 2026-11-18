const APEX = 'jonyen.com';

export function createHandler() {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.hostname === `www.${APEX}`) {
        url.hostname = APEX;
        return Response.redirect(url.toString(), 301);
      }
      return env.ASSETS.fetch(request);
    },
  };
}
