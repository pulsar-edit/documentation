const MarkdownIT = require("markdown-it");
const prism = require('markdown-it-prism');
const PRISM_LANGUAGE_SCM = require('../../plugins/prism-language-scm.js');

const md = MarkdownIT({
  html: true
})
.use(require("../../markdown-it-plugins/hovercard.js"))
.use(prism, {
  init (Prism) {
    Prism.languages.scm = PRISM_LANGUAGE_SCM;
  }
});

module.exports =
function mdRender(content, env = {}) {
  return md.render(content, env);
}
