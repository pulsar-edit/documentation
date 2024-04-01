const FS = require('fs');
const { classMethodAnchor, instanceMethodAnchor, simplifyLabel } = require('../hovercard_resolution/util');
const STATIC_HOVERCARDS = require('../hovercard_resolution/static_hovercards.json');

const STATIC_HOVERCARD_URLS = new Map();
for (let value of Object.values(STATIC_HOVERCARDS)) {
  STATIC_HOVERCARD_URLS.set(value.title, value.link);
}

module.exports =
function setup(md) {
  md.inline.ruler.push("hovercard", replacer);
}

function replacer(state) {
  if (state.src.charAt(state.pos) !== "{") { return false }
  const max = state.posMax;
  let pos;

  const labelStart = state.pos + 1;
  const labelEnd = parseHovercard(state, state.pos + 1);
  if (labelEnd < 0) { return false }

  pos = labelEnd + 1;
  const label = state.src.slice(labelStart, labelEnd);

  let normalizedLabel = label;
  if (state.env?.type === 'api') {
    if (label.startsWith('::')) {
      // Disambiguate this label name by including the name of the page we're
      // on.
      normalizedLabel = `${state.env.name}${label}`;
    }
  }
  let simpleLabel = simplifyLabel(normalizedLabel);

  state.pos = labelStart;
  state.posMax = labelEnd;

  let href;
  if (STATIC_HOVERCARD_URLS.has(label)) {
    href = STATIC_HOVERCARD_URLS.get(label);
  } else {
    href = inferHrefFromHovercardText(label, state.env?.type === 'api');
  }

  const token_o = state.push("a_open", "a", 1);
  const attrs = [
    ["data-hovercard", simpleLabel],
    ["data-hovercard-full", normalizedLabel],
    ["href", href]
  ];
  token_o.attrs = attrs;

  state.linkLevel++;
  state.md.inline.tokenize(state);
  state.linkLevel--;

  state.push("a_close", "a", -1);

  // Sometimes we need to transform hovercard syntax without any filesystem
  // side-effects.
  if (!state.env?.skip_hovercard) {
    storeHovercard(simpleLabel, normalizedLabel);
  }

  state.pos = pos;
  state.posMax = max;
  return true;
}

function parseHovercard(state, start) {
  const max = state.posMax;
  const oldPos = state.pos;
  let found = false;

  state.pos = start + 1;

  while (state.pos < max) {
    let marker = state.src.charAt(state.pos);
    if (marker === "}") {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }

  let labelEnd = -1;

  if (found) {
    labelEnd = state.pos;
  }

  // restore old state
  state.pos = oldPos;

  return labelEnd;
}

const INSTANCE_METHOD_PATTERN = /([A-Za-z]+)::([A-Za-z]+)/
const CLASS_METHOD_PATTERN = /([A-Za-z]+)\.([A-Za-z]+)/
function inferHrefFromHovercardText (text, isApiPage) {
  // If we're generating this from an API page, we should link relatively so
  // that we point to whatever version of the API docs we're already in. If
  // we're not on an API page, then we're in the main docs, which should always
  // point to the most recent API docs.
  let base = isApiPage ? '..' : `/api/pulsar/latest`;
  if (text.startsWith('::')) {
    return instanceMethodAnchor(text.substring(2));
  }
  if (text.match(/^\.\w/)) {
    return classMethodAnchor(text.substring(1));
  }
  let match = text.match(INSTANCE_METHOD_PATTERN);
  if (match) {
    let [_, klass, method] = match;
    return `${base}/${klass}/${instanceMethodAnchor(method)}`;
  }
  match = text.match(CLASS_METHOD_PATTERN);
  if (match) {
    let [_, klass, method] = match;
    return `${base}/${klass}/${classMethodAnchor(method)}`;
  }
  // One we've filtered out references to methods and properties, the remaining
  // possible meanings are (a) class names and (b) names of packages.
  if (!text.includes(' ')) {
    if (text.charAt(0).toUpperCase() === text.charAt(0)) {
      // This is a capitalized word, so it's probably a class reference.
      return `${base}/${text}`;
    } else {
      // It's a single word that starts with a lower-case letter, so it's
      // probably a package name.
      //
      // TODO: We might just want to add a whitelist of package names to
      // `static_hovercards.json`.
      return `https://web.pulsar-edit.dev/packages/${text}`;
    }
  }

  // If we get this far, we're out of ideas.
  return '#';
}

const HOVERCARD_STORE = new Map();

function storeHovercard (simpleLabel, label) {
  let size = HOVERCARD_STORE.size
  HOVERCARD_STORE.set(simpleLabel, label);
  if (HOVERCARD_STORE.size > size) {
    writeHovercardStoreToDisk();
  }
}

function writeHovercardStoreToDisk () {
  let keys = Array.from(HOVERCARD_STORE.keys());
  keys.sort();
  let obj = {};
  for (let key of keys) {
    obj[key] = HOVERCARD_STORE.get(key);
  }
  let json = JSON.stringify(obj, null, 2);
  FS.writeFileSync('hovercard_list.json', json);
}
