
// View helpers. Available in EJS templates via the `helpers` namespace.

module.exports = {
  nextAndPreviousSidebarEntries(title, sidebar) {
    let prev = null, next = null;
    let lastIndex = sidebar.length - 1;
    let index = sidebar.findIndex(entry => entry.text === title);
    if (index) {
      if (index > 0) prev = sidebar[index - 1];
      if (index < lastIndex) next = sidebar[index + 1];
    }
    return [prev, next];
  }
};
