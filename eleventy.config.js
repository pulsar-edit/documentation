const pulsarApi = require("./pulsar-api/src/index.js");
const hovercardResolution = require("./hovercard_resolution/index.js");

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
  eleventyConfig.addPassthroughCopy({ "dot-github/images": "img" });
  // copy the data from static to static
  eleventyConfig.addPassthroughCopy({ "static": "static" });

  // Utilize Eleventy events to trigger Pulsar API Documentation Generation
  eleventyConfig.on("eleventy.after", async (data) => {
    await pulsarApi();
    await hovercardResolution();
  });

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
