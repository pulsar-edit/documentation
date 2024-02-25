
module.exports = (eleventyConfig) => {

  // Add custom templates
  eleventyConfig.addTemplateFormats("less");
  eleventyConfig.addExtension("less", require("./plugins/less.js"));

  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", require("./plugins/terser.js"));

  eleventyConfig.addTransform("clean-css", require("./plugins/clean-css.js"));

  eleventyConfig.setLibrary("md", require("./plugins/markdown-it.js"));

  // Add custom collections

  // Return config
  return {
    dir: {
      input: "docs",
      output: "_dist",
      // Below values are relative to the `./docs` folder
      layouts: "../layouts",
      data: "../data"
    }
  };
};
