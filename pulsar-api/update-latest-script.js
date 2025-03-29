// Updates the version in `latest.json` to the one provided when running this file 
const fs = require("fs");
const path = require("path");

const newVer = process.argv.slice(2)[0]; // take first argument
const verFile = JSON.parse(fs.readFileSync(path.join(__dirname, "./latest.json"), { encoding: "utf8" }));

verFile.latest = newVer;

fs.writeFileSync(path.join(__dirname, "./latest.json"), JSON.stringify(verFile, null, 2), { encoding: "utf8" });
