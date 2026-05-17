const path = require('path');

const pulsarApi = require("./pulsar-api/src/index.js");
const hovercardResolution = require("./hovercard_resolution/index.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const less = require("less");
const _helpers = require('./helpers');
const PRISM_LANGUAGE_SCM = require('./plugins/prism-language-scm');

module.exports = (eleventyConfig) => {

  // `pagefind` is ESM, so has to be `import`ed rather than `require`d. Can't
  // use `await` at the top level or in this function (not until we upgrade to
  // 11ty v3) so we'll do it later.
  const pagefindImport = import('pagefind');

  eleventyConfig.setServerOptions({
    // Prevent the server from trying to do a clever hot-reload when only
    // Markdown is changed. We have JavaScript code that needs to react to
    // changed content, so it’s better to reload the page instead.
    domDiff: false
  });

  // Regenerate the search index after changes.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    // Now we can `await` the import we couldn't above.
    let pagefind = await pagefindImport;

    const { index } = await pagefind.createIndex({
      excludeSelectors: [
        ".sidebar",
        ".page_header",
        ".page_footer",
        ".adjacent",
        ".platform-win",
        ".platform-mac"
      ],
      verbose: process.env.DEBUG
    });

    await index.addDirectory({
      path: dir.output,
      // This dumb glob allows us to exclude all of `api` except for the one set
      // of API docs we care about (the latest). This works fine as long as `api`
      // is the only section that starts with A.
      //
      // (Pagefind uses Wax, a Rust glob library whose negation syntax is not
      // very robust.)
      glob: "{*.html,[b-z]*/**/*.html,api/pulsar/latest/**/*.html}"
    });

    await index.writeFiles({
      outputPath: path.join(dir.output, 'pagefind')
    });
  });

  eleventyConfig.addPlugin(syntaxHighlight, {
    init({ Prism }) {
      Prism.languages.scm = PRISM_LANGUAGE_SCM;
    }
  });

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
  eleventyConfig.addPassthroughCopy({ "img": "img" });
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
