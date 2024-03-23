
module.exports =
function setup(md) {
  md.inline.ruler.push("hovercard", replacer);
}

function replacer(state) {

  const oldPos = state.pos;
  const max = state.posMax;
  let pos;

  if (state.src.charAt(state.pos) !== "{") { return false }

  const labelStart = state.pos + 1;
  const labelEnd = parseHovercard(state, state.pos + 1);

  if (labelEnd < 0) { return false }

  pos = labelEnd + 1;
  const label = state.src.slice(labelStart, labelEnd);

  const content = state.src.slice(labelStart, labelEnd);

  state.pos = labelStart;
  state.posMax = labelEnd;

  const token_o = state.push("a_open", "a", 1);
  const attrs = [
    ["data-hovercard", simplifyLabel(label)],
    ["href", "#"]
  ];
  token_o.attrs = attrs;

  state.linkLevel++;
  state.md.inline.tokenize(state);
  state.linkLevel--;

  state.push("a_close", "a", -1);

  // call our hovercard tracker
  writeDownHovercard(simplifyLabel(label));

  state.pos = pos;
  state.posMax = max;
  return true;
}

function parseHovercard(state, start) {
  const max = state.posMax;
  const oldPos = state.pos;
  let found = false;

  state.pos = start + 1;

  while(state.pos < max) {
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

function simplifyLabel(str) {
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9]/gi, "_");
  return str;
}

function writeDownHovercard(str) {
  const fs = require("fs");

  let current = [];

  if (fs.existsSync("hovercard_list.json")) {
    current = JSON.parse(fs.readFileSync("hovercard_list.json", { encoding: "utf8" }));
  }

  if (current.includes(str)) {
    return;
  }

  current.push(str);

  fs.writeFileSync("hovercard_list.json", JSON.stringify(current, null, 2), { encoding: "utf8" });
}
