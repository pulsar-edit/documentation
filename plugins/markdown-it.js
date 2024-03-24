const MarkdownIT = require("markdown-it");

const { tab } = require("@mdit/plugin-tab");
const container = require("markdown-it-container");

const md = MarkdownIT({
  html: true
});

function makeContainerRenderer (name) {
  return (tokens, idx) => {
    const titlePattern = new RegExp(`^${name}\\s+(.*)$`);
    const content = tokens[idx].info.trim().match(titlePattern);

    if (tokens[idx].nesting === 1) {
      let openingTag = `<aside class="${name} custom-container">\n`;
      if (content) {
        openingTag += `<div class="custom-container-title">${md.utils.escapeHtml(content[1])}</div>`;
      }
      return openingTag;
    } else {
      return `</aside>\n`;
    }
  }
}

module.exports =
md
.use(
  require("markdown-it-attrs"),
  {
    leftDelimiter: "$",
    rightDelimiter: "$"
  }
).use(
  require("markdown-it-kbd"),
  {}
).use(
  require("markdown-it-include"),
  "./"
).use(
  tab,
  { name: "tabs" }
).use(
  container,
  "warning",
  { render: makeContainerRenderer("warning") }
).use(
  container,
  "info",
  { render: makeContainerRenderer("info") }
).use(
  container,
  "note",
  { render: makeContainerRenderer("note") }
).use(
  container,
  "tip",
  { render: makeContainerRenderer("tip") }
).use(
  container,
  "danger",
  { render: makeContainerRenderer("danger") }
).use(
  require("../markdown-it-plugins/hovercard.js")
).use(
  require("markdown-it-anchor")
);
