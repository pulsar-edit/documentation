const MarkdownIT = require("markdown-it");

const md = MarkdownIT({
  html: true
})
.use(require("../../markdown-it-plugins/hovercard.js"));

module.exports =
function mdRender(content) {
  return md.render(content);
}
