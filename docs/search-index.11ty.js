module.exports =
class SearchIndex {
  constructor() {}
  data() {
    // Export Front Matter
    return {
      permalink: "/search-index.jsonl",
      eleventyExcludeFromCollections: true
    };
  }
  render(data) {
    let str = "";

    for (const pageIdx in data.collections.all) {
      const page = data.collections.all[pageIdx];
      if (page.page.outputFileExtension === "html") {
        // Only include HTML content into our Search Index File
        const obj = {
          url: page.url,
          title: page.data.title,
          body: page.content
        };
        str += `${JSON.stringify(obj)}\n`;
      }
    }

    return str;
  }
}
