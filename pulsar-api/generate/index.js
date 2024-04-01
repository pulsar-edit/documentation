const fs = require("fs");
const path = require("path");
const semver = require("semver");
const PulsarDoc = require("pulsardoc").PulsarDocLegacy;
const modify = require("./modify.js");

const latest = JSON.parse(fs.readFileSync(path.join(__dirname, "../latest.json"), { encoding: "utf8" }));

const current = JSON.parse(fs.readFileSync(path.join(__dirname, "../../submodules/pulsar/package.json"), { encoding: "utf8" }));
const curVer = current.version.replace("-dev", "");

// if (semver.lte(curVer, latest.latest)) {
//   console.log(`Pulsar's version '${curVer}' is not newer than '${latest.latest}' and does not qualify for a generation of new docs.`);
//   process.exit(0);
// }

const pulsardoc = new PulsarDoc(
  [
    path.join(__dirname, "../../submodules/node-pathwatcher/src"),
    path.join(__dirname, "../../submodules/atom-keymap/src"),
    path.join(__dirname, "../../submodules/event-kit/lib"),
    path.join(__dirname, "../../submodules/second-mate/lib"),
    path.join(__dirname, "../../submodules/text-buffer/src"),
    path.join(__dirname, "../../submodules/pulsar/src")
  ]
).main();

// Apply any modifications
modify(pulsardoc, {
  // add versions for all the submodules included
  pulsar: curVer,
  pathwatcher: JSON.parse(fs.readFileSync(path.join(__dirname, "../../submodules/node-pathwatcher/package.json"), { encoding: "utf8" })).version,
  keymap: JSON.parse(fs.readFileSync(path.join(__dirname, "../../submodules/atom-keymap/package.json"), { encoding: "utf8" })).version,
  eventkit: JSON.parse(fs.readFileSync(path.join(__dirname, "../../submodules/event-kit/package.json"), { encoding: "utf8" })).version,
  secondmate: JSON.parse(fs.readFileSync(path.join(__dirname, "../../submodules/second-mate/package.json"), { encoding: "utf8" })).version,
  textbuffer: JSON.parse(fs.readFileSync(path.join(__dirname, "../../submodules/text-buffer/package.json"), { encoding: "utf8" })).version
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
