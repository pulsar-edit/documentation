const MarkdownIT = require("markdown-it");

const { tab } = require("@mdit/plugin-tab");
const container = require("markdown-it-container");

const md = MarkdownIT({
  html: true
});

const containerRender = (name) => {
  return (tokens, idx) => {
    const str = `^${name}\\s+(.*)$`;
    const reg = new RegExp(str);
    const content = tokens[idx].info.trim().match(reg);

    if (tokens[idx].nesting === 1) {
      // opening tag
      let openingTag = `<div class="${name} custom-container">\n`;

      if (content) {
        openingTag += `<p class="custom-container-title">${md.utils.escapeHtml(content[1])}</p>`;
      }

      return openingTag;
    } else {
      // closing tag
      return "</div>\n";
    }
  };
};

module.exports =
md
.use(require("markdown-it-attrs"), {
  leftDelimiter: "{",
  rightDelimiter: "}"
}).use(require("markdown-it-kbd"), {

}).use(require("markdown-it-include"),
  "_partial_docs"
).use(tab, {
  name: "tabs"
}).use(container,
  "warning", { render: containerRender("warning") }
).use(container,
  "info", { render: containerRender("info") }
).use(container,
  "note", { render: containerRender("note") }
);
