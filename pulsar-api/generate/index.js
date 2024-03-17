const fs = require("fs");
const path = require("path");
const semver = require("semver");
const PulsarDoc = require("pulsardoc").PulsarDocLegacy;
const modify = require("./modify.js");

const latest = JSON.parse(fs.readFileSync(path.join(__dirname, "../latest.json"), { encoding: "utf8" }));

const current = JSON.parse(fs.readFileSync(path.join(__dirname, "../../pulsar/package.json"), { encoding: "utf8" }));
const curVer = current.version.replace("-dev", "");

if (semver.lte(curVer, latest.latest)) {
  console.log(`Pulsar's version '${curVer}' is not newer than '${latest.latest}' and does not quality for a generation of new docs.`);
  process.exit(0);
}

const pulsardoc = new PulsarDoc(
  [
    path.join(__dirname, "../../pulsar/src"),
    //path.join(__dirname, "../../node-pathwatcher/src"), // TODO awaiting coffee support in pulsardoc
    //path.join(__dirname, "../../atom-keymap/src"), // TODO awaiting coffee support in pulsardoc
    path.join(__dirname, "../../event-kit/lib"),
    path.join(__dirname, "../../second-mate/lib"),
    //path.join(__dirname, "../../text-buffer/src") // TODO awaiting coffee support in pulsardoc
  ]
).main();

// Apply any modifications
modify(pulsardoc, {
  // add versions for all the submodules included
  pulsar: curVer,
  pathwatcher: JSON.parse(fs.readFileSync(path.join(__dirname, "../../node-pathwatcher/package.json"), { encoding: "utf8" })).version,
  keymap: JSON.parse(fs.readFileSync(path.join(__dirname, "../../atom-keymap/package.json"), { encoding: "utf8" })).version,
  eventkit: JSON.parse(fs.readFileSync(path.join(__dirname, "../../event-kit/package.json"), { encoding: "utf8" })).version,
  secondmate: JSON.parse(fs.readFileSync(path.join(__dirname, "../../second-mate/package.json"), { encoding: "utf8" })).version,
  textbuffer: JSON.parse(fs.readFileSync(path.join(__dirname, "../../text-buffer/package.json"), { encoding: "utf8" })).version
});

// Write files

fs.writeFileSync(
  path.join(__dirname, "../content", `${curVer}.json`),
  JSON.stringify(pulsardoc, null, 2),
  { encoding: "utf8" }
);

fs.writeFileSync(
  path.join(__dirname, "../latest.json"),
  JSON.stringify({ latest: curVer }, null, 2),
  { encoding: "utf8" }
);

console.log(`Generated new Pulsar API Docs off of version '${curVer}'`);

process.exit(0);
