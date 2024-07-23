// View helpers. Available in EJS templates via the `helpers` namespace.

const fs = require("fs");
const semver = require("semver");

module.exports = {
  nextAndPreviousSidebarEntries(url, sidebar) {
    let prev = null, next = null;
    if (!url) return [prev, next];
    let lastIndex = sidebar.length - 1;
    let index = sidebar.findIndex(entry => entry.link === url || `${entry.link}/` === url);
    if (index > -1) {
      if (index > 0) prev = sidebar[index - 1];
      if (index < lastIndex) next = sidebar[index + 1];
    }
    return [prev, next];
  },

  getAllPulsarVersions() {
    // Returns an array of Pulsar semver versions, in order, and without 'latest'

    let verArr = [];

    const verDocs = fs.readdirSync("./pulsar-api/content");

    for (const doc of verDocs) {
      let clean = doc.replace(".json", "");

      let name = clean;

      if (!name.startsWith("v")) {
        name = "v" + name;
      }

      verArr.push({
        name: name,
        link: clean
      });
    }

    // Sort version array in order
    verArr.sort((a, b) => { return semver.rcompare(a.name, b.name); });

    return verArr;
  }
};
