module.exports =
class SearchPreview {
  constructor() {}
  data() {
    // Export Front Matter
    return {
      permalink: "/search-preview.json",
      eleventyExcludeFromCollections: true
    };
  }
  render(data) {
    let obj = { pages: {} };

    for (const pageIdx in data.collections.all) {
      const page = data.collections.all[pageIdx];
      if (page.page.outputFileExtension === "html") {
        // Only include HTML content into our search preview file, since
        // that's what we include in our search index file
        obj.pages[page.url] = {
          title: page.data.title,
          summary: "A quick summary of the content of this page."
        };
      }
    }

    return JSON.stringify(obj);
  }
}
