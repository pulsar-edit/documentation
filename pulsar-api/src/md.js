const MarkdownIT = require("markdown-it");

const md = MarkdownIT({
  html: true
});

module.exports =
function mdRender(content) {
  return md.render(content);
}
