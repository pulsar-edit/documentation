
// View helpers. Available in EJS templates via the `helpers` namespace.

module.exports = {
  nextAndPreviousSidebarEntries(url, sidebar) {
    let prev = null, next = null;
    if (!url) return [prev, next];
    let lastIndex = sidebar.length - 1;
    let index = sidebar.findIndex(entry => entry.link === url || `${entry.link}/` === url);
    if (index) {
      if (index > 0) prev = sidebar[index - 1];
      if (index < lastIndex) next = sidebar[index + 1];
    }
    return [prev, next];
  }
};
