// Deals the memoji's fixed sayings like a shuffled deck: every saying comes up
// once before any repeats, and a new deck never starts with the last one
// shown. The deck lives in sessionStorage so a reload mid-deck carries on;
// editing the sayings changes the version key, which starts a fresh deck.

const STORAGE_KEY = 'memoji-sayings-bag';
// Id of the "You're visitor #N today!" line, whose text changes with the count.
export const VISITOR_ID = 'visitor';

// Small string hash (FNV-1a), enough to notice that the list was edited.
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function load(version) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (saved && saved.version === version && Array.isArray(saved.order)) return saved;
  } catch {
    // No storage (private mode, blocked): the deck lives in memory only.
  }
  return null;
}

function save(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Same as above; memory still has it.
  }
}

// texts: the fixed sayings' texts, in list order. Ids are their indexes, plus
// VISITOR_ID once the visitor line exists.
export function createBag(texts) {
  const version = hash(texts.join('\n'));
  const ids = texts.map((_, i) => i);
  let hasVisitor = false;
  let state = load(version) || { version, order: [], pos: 0, last: null };

  const newDeck = () => {
    const order = shuffle(hasVisitor ? [...ids, VISITOR_ID] : ids);
    // Don't open the new deck with the line that closed the last one.
    if (order.length > 1 && order[0] === state.last) {
      const j = 1 + Math.floor(Math.random() * (order.length - 1));
      [order[0], order[j]] = [order[j], order[0]];
    }
    state = { ...state, order, pos: 0 };
  };

  return {
    // Next id to show. skip(id) says whether an id can't be shown right now
    // (the visitor line before its count has loaded); such ids are passed over.
    deal(skip = () => false) {
      for (let tries = 0; tries <= ids.length + 1; tries += 1) {
        if (state.pos >= state.order.length) newDeck();
        const id = state.order[state.pos];
        state = { ...state, pos: state.pos + 1 };
        if (!skip(id)) {
          state = { ...state, last: id };
          save(state);
          return id;
        }
      }
      save(state);
      return null;
    },
    // The visitor line became available: slot it in at a random spot among the
    // sayings not yet shown in this deck, unless the deck already has it.
    addVisitor() {
      hasVisitor = true;
      if (state.order.includes(VISITOR_ID)) return;
      const order = [...state.order];
      const at = state.pos + Math.floor(Math.random() * (order.length - state.pos + 1));
      order.splice(at, 0, VISITOR_ID);
      state = { ...state, order };
      save(state);
    },
  };
}
