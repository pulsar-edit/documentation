const MarkdownIT = require("markdown-it");
const prism = require('markdown-it-prism');

const md = MarkdownIT({
  html: true
})
.use(require("../../markdown-it-plugins/hovercard.js"))
.use(prism);

module.exports =
function mdRender(content, env = {}) {
  return md.render(content, env);
}
