const pulsarApi = require("./pulsar-api/src/index.js");
const hovercardResolution = require("./hovercard_resolution/index.js");
const less = require("less");
const _helpers = require('./helpers');

module.exports = (eleventyConfig) => {

  // Add custom templates
  eleventyConfig.addTemplateFormats("less");
  eleventyConfig.addExtension("less", {
    outputFileExtension: "css",
    compile: async function (input, inputPath) {
      try {
        const output = await less.render(input, {
          math: "always" // required for use with Skeleton
        });

        this.addDependencies(inputPath, output.imports)
        return async () => output.css;
      } catch(err) {
        console.error(`Error compiling less:\n`, err);
        throw err;
      }
    }
  })

  eleventyConfig.addTemplateFormats("js");
  eleventyConfig.addExtension("js", require("./plugins/terser.js"));

  eleventyConfig.addTransform("clean-css", require("./plugins/clean-css.js"));

  eleventyConfig.setLibrary("md", require("./plugins/markdown-it.js"));

  // Add passthrough file copies

  // copy the images from `pulsar-edit/.github`
  eleventyConfig.addPassthroughCopy({ "submodules/dot-github/images": "img" });
  // copy the data from static to static
  eleventyConfig.addPassthroughCopy({ "static": "static" });

  // Utilize Eleventy events to trigger Pulsar API Documentation Generation
  eleventyConfig.on("eleventy.after", async () => {
    await pulsarApi();
    await hovercardResolution();
  });

  eleventyConfig.addWatchTarget("./less/");

  // Defining a global from within this closure seems to be the magical way to
  // make something visible to EJS.
  globalThis.helpers = _helpers;

  // Return config
  return {
    markdownTemplateEngine: false,
    // ^^ We can't parse md in liquidjs or njk, because our docs seem to have
    // naturally occurring instances of both of their delimiters.
    // So for now we will just disable any templating on markdown
    dir: {
      input: "docs",
      output: "_dist",
      includes: "less",
      // Below values are relative to the `./docs` folder
      layouts: "../layouts",
      data: "../data"
    }
  };
};
