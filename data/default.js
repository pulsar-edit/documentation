module.exports = {
  // Here we can provide defaults for some data values that will be used within
  // our templates, to ensure if they aren't defined in a given markdown document
  // everything still works when rendering EJS
  title: "Pulsar Documentation",
  layout: "doc.ejs", // Have the default view be the one used most often
  changefreq: "monthly",
  url: "https://docs.pulsar-edit.dev"
};
