
module.exports = (eleventyConfig) => {

  // Add custom templates
  eleventyConfig.addTemplateFormats("less");
  eleventyConfig.addExtension("less", require("./plugins/less.js"));

  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", require("./plugins/terser.js"));

  eleventyConfig.addTransform("clean-css", require("./plugins/clean-css.js"));

  eleventyConfig.setLibrary("md", require("./plugins/markdown-it.js"));

  // Add passthrough file copies

  // copy the images from `pulsar-edit/.github`
  eleventyConfig.addPassthroughCopy({ ".github/images": "img" });

  // Add custom collections

  // Return config
  return {
    markdownTemplateEngine: false,
    // ^^ We can't parse md in liquidjs or njk, because our docs seem to have
    // naturally occurring instances of both of their delimiters.
    // So for now we will just disable any templating on markdown 
    dir: {
      input: "docs",
      output: "_dist",
      // Below values are relative to the `./docs` folder
      layouts: "../layouts",
      data: "../data"
    }
  };
};
