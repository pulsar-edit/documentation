class SearchUtility {
  constructor() {
    this.api = "https://search.pulsar-edit.dev/search/docs";
    this.isSearchUrl = location.pathname.startsWith("/search");

    this.searchTerm = "";
    this.searchResults = [];
    this.searchPreviews = {};
  }

  async setup() {
    if (!this.isSearchUrl) { return; }
    // Get our search term
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    this.searchTerm = searchParams.get("q");

    // Get our search preview
    try {
      const response = await fetch("/search-preview.json");

      if (!response.ok) {
        console.error(response);
        return;
      }

      const data = await response.json();
      this.searchPreviews = data.pages;
    } catch(err) {
      console.error(err);
    }
  }

  async search() {
    if (!this.isSearchUrl || this.searchTerm?.length === 0 || typeof this.searchTerm !== "string") {
      return;
    }

    try {
      const response = await fetch(`${this.api}?q=${this.searchTerm}`);

      if (!response.ok) {
        console.error(response);
        return;
      }

      const data = await response.json();
      this.searchResults = data.results;

    } catch(err) {
      console.error(err);
      return;
    }
  }

  display() {
    const resultsContainer = document.createElement("ul");
    resultsContainer.classList.add("list");

    for (const result of this.searchResults) {
      const resultPreview = this.searchPreviews[result.ref];

      const node = document.createElement("li");
      node.classList.add("list-item");
      node.innerHTML = `
        <div class="list-item__inner">
          <div class="list-item__icon"></div>
          <h3 class="list-item__name">
            <a href="${this.createSearchLink(result)}">${resultPreview.title}</a>
          </h3>
          <div class="list-item__summary">${resultPreview.summary}</div>
        </div>
      `;

      resultsContainer.append(node);
    }

    document.querySelector("main").append(resultsContainer);
  }

  createSearchLink(searchResult) {
    // Takes a search result item directly from the search API, and creates a link
    // to the content indicated by the result. Will use Text Fragments if supported
    // in the current browser.
    let link = searchResult.ref; // Base link

    if (document.fragmentDirective !== undefined) {
      // This browser supports text fragments
      let fragment = "#:~:";

      for (let term in searchResult.matchData.metadata) {
        if (fragment.includes("text=")) {
          // If we are appending additional fragments to a directive, add `&`
          fragment = `${fragment}&`;
        }
        fragment = `${fragment}text=${term}`;
      }

      link = `${link}${fragment}`;
    }

    return link;
  }
}

(async () => {
  const search = new SearchUtility();
  search.setup();
  await search.search();
  search.display();
})();
