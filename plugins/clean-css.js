const CleanCSS = require("clean-css");

module.exports =
async function transform(content) {
  if (this.page.outputPath && this.page.outputPath.endsWith(".css")) {
    const output = new CleanCSS({ sourceMap: false }).minify(content);

    return output.styles;
  }

  return content;
}
