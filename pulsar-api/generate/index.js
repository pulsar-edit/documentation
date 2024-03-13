const fs = require("fs");
const path = require("path");
const semver = require("semver");
const pulsardoc = require("pulsardoc");

const latest = JSON.parse(fs.readFileSync(path.join(__dirname, "../latest.json"), { encoding: "utf8" }));

const current = JSON.parse(fs.readFileSync(path.join(__dirname, "../pulsar/package.json"), { encoding: "utf8" }));

if (semver.lte(current, latest)) {
  console.log(`Pulsar's version '${current}' is not newer than '${latest}' and does not quality for a generation of new docs.`);
  process.exit(0);
}
