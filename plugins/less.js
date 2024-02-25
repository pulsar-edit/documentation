const less = require("less");

module.exports = {
  outputFileExtension: "css",
  compile: async (input) => {
    try {
      const output = await less.render(input, {
        math: "always" // required for use with Skeleton
      });

      return async (data) => {
        return output.css;
      };

    } catch(err) {
      console.error(err);
      throw err;
    }
  }
};
