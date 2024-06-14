const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const convert = require("./json2html.js");
const mdRender = require("./md.js");

const IN = path.join(__dirname, "../content");
const OUT = path.join(__dirname, "../../_dist/api/pulsar");

const LAYOUT_DIR = path.resolve(__dirname, "../../layouts/api")
const ROOT_LAYOUT_DIR = path.resolve(__dirname, "../../layouts")

const LAYOUT_CACHE = new Map();
function getLayout(name) {
  let layoutPath = path.join(LAYOUT_DIR, `${name}.ejs`);
  if (!LAYOUT_CACHE.has(name)) {
    let layout = fs.readFileSync(layoutPath, { encoding: "utf8" });
    LAYOUT_CACHE.set(name, layout);
  }
  return LAYOUT_CACHE.get(name);
}

const VERSION_CACHE = new Map();

async function main() {

  // create our output dir if it doesn't exist
  createDirIfAbsent(OUT);

  await enumerateFiles(IN, [], (file, _pathArray, filename, _immediateReturn) => {
    try {
      VERSION_CACHE.set(
        filename.replace(/\.json$/, ''),
        JSON.parse(fs.readFileSync(file, { encoding: "utf8" }))
      );
    } catch(err) {
      console.error(err);
      console.error(`Failed to read: ${filename}`);
    }
  });

  const latestVer = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../latest.json"),
      { encoding: "utf8" }
    )
  ).latest;

  const sidebarDocsData = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../../docs/docs.11tydata.json"),
      { encoding: "utf8" }
    )
  );

  for (let version of VERSION_CACHE.keys()) {
    let isLatestVer = version === latestVer;

    // Create the summary page
    let summaryHTML = ejs.render(
      getLayout("summary"),
      {
        version,
        title: version,
        sidebar: sidebarDocsData.root_sidebar,
        blocks: content2sidebar(VERSION_CACHE.get(version).classes, version)
      },
      {
        views: [ROOT_LAYOUT_DIR]
      }
    );

    writeContentForNameAndVersion(summaryHTML, null, version, isLatestVer);

    let allClasses = VERSION_CACHE.get(version).classes;
    for (let [name, klass] of Object.entries(allClasses)) {
      let html = convert(name, klass, version);
      writeContentForNameAndVersion(html, name, version, isLatestVer);
    }
  }
}

function writeContentForNameAndVersion (content, name, version, isLatestVer) {
  if (name === null) {
    outputPath = path.join(OUT, version);
  } else {
    outputPath = path.join(OUT, version, name);
  }
  createDirIfAbsent(outputPath);
  let outputFilePath = path.join(outputPath, 'index.html');
  console.log(`[pulsar-api] Writing ${path.relative(process.cwd(), outputFilePath)}`);
  fs.writeFileSync(outputFilePath, content, { encoding: 'utf8' });

  if (isLatestVer) {
    writeContentForNameAndVersion(content, name, 'latest', false);
  }
}

function content2sidebar(content, version) {
  // Ensure items are sorted alphabetically.
  let map = new Map();
  for (let item of Object.values(content)) {
    map.set(item.name, item);
  }

  let keys = Array.from(map.keys()).sort();
  let sidebar = [];

  for (let key of keys) {
    let item = map.get(key);
    let name = item.customData?.name ?? item.name
    sidebar.push({
      text: name,
      summary: mdRender(item.summary, { type: 'api', name, version }),
      link: item.name
    });
  }

  return sidebar;
}

async function enumerateFiles(dir, pathArray, fileCallback) {
  // dir: The starting directory
  // pathArray: The array of path entries
  // fileCallback: Function to invoke when a file is found
  // When a callback is invoked the following is passed:
  // - file: Which is the file and its preceeding path. A relative path to a specific file.
  // - pathArray: The path as an array leading up to that file, from the initial dir passed.
  // - filename: The specific file's name.
  // - immediateReturn: An overloaded paramter passed only when the immediate dir
  //   passed was a direct file path.

  if (fs.lstatSync(dir).isFile()) {
    // The initial dir is a file, not a dir
    await fileCallback(dir, pathArray, path.basename(dir), true);
    return;
  }

  let files = fs.readdirSync(dir);

  for (const file of files) {
    let target = path.join(dir, file);

    if (fs.lstatSync(target).isDirectory()) {
      await enumerateFiles(`./${target}`, [ ...pathArray, file], fileCallback);
    } else {
      await fileCallback(target, pathArray, file);
    }
  }
}

function createDirIfAbsent(file) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file);
  }
}

module.exports = main;
