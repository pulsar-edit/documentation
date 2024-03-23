const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const convert = require("./json2html.js");
const mdRender = require("./md.js");

const IN = path.join(__dirname, "../content");
const OUT = path.join(__dirname, "../../_dist/api/pulsar");

const LAYOUT_DIR = path.resolve(__dirname, "../../layouts/api")
const ROOT_LAYOUT_DIR = path.resolve(__dirname, "../../layouts")

function getLayout (name) {
  let layoutPath = path.join(LAYOUT_DIR, `${name}.ejs`);
  return fs.readFileSync(layoutPath, { encoding: "utf8" })
}

module.exports =
async function main() {
  const objs = {};

  // create our output dir if it doesn't exist
  await createIfDirAbsent(OUT);

  await enumerateFiles(IN, [], (file, pathArray, filename, immediateReturn) => {
    try {
      objs[filename.replace(".json", "")] = JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
    } catch(err) {
      console.error(err);
      console.error(`Failed to read: ${filename}`);
    }
  });

  // OBJS now has all API content
  const latestVer = JSON.parse(fs.readFileSync(path.join(__dirname, "../latest.json"), { encoding: "utf8" } )).latest;

  for (let item in objs) {
    let isLatestVer = false;

    if (item == latestVer) {
      isLatestVer = true;
      // this means the current version we are documenting is the latest version
    }

    await createIfDirAbsent(path.join(OUT, item));

    if (isLatestVer) {
      await createIfDirAbsent(path.join(OUT, "latest"));
    }

    // Create the summary page
    let summaryHTML = ejs.render(
      getLayout("summary"),
      {
        title: item,
        sidebar: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../docs/docs.11tydata.json"), { encoding: "utf8" })).root_sidebar,
        blocks: content2sidebar(objs[item].classes)
      },
      {
        views: [ROOT_LAYOUT_DIR]
      }
    );

    fs.writeFileSync(
      path.join(OUT, item, "index.html"),
      summaryHTML,
      { encoding: "utf8" }
    );
    console.log(`[pulsar-api] Writing ${path.relative(process.cwd(), path.join(OUT, item, "index.html"))}`);

    if (isLatestVer) {
      fs.writeFileSync(
        path.join(OUT, "latest", "index.html"),
        summaryHTML,
        { encoding: "utf8" }
      );
      console.log(`[pulsar-api] Writing ${path.relative(process.cwd(), path.join(OUT, "latest", "index.html"))}`);
    }

    for (let apiClass in objs[item].classes) {
      let html = await convert(apiClass, objs[item].classes[apiClass]);

      await createIfDirAbsent(path.join(OUT, item, apiClass));

      if (isLatestVer) {
        await createIfDirAbsent(path.join(OUT, "latest", apiClass));
      }

      fs.writeFileSync(
        path.join(OUT, item, apiClass, "index.html"),
        html,
        { encoding: "utf8" }
      );
      console.log(`[pulsar-api] Writing ${path.relative(process.cwd(), path.join(OUT, item, apiClass, "index.html"))}`);

      if (isLatestVer) {
        fs.writeFileSync(
          path.join(OUT, "latest", apiClass, "index.html"),
          html,
          { encoding: "utf8" }
        );
        console.log(`[pulsar-api] Writing ${path.relative(process.cwd(), path.join(OUT, "latest", apiClass, "index.html"))}`);
      }
    }

  }

}

function content2sidebar(content) {
  let sidebar = [];

  for (let item in content) {
    sidebar.push({
      text: content[item].name,
      summary: mdRender(content[item].summary),
      link: content[item].name
    });
  }

  return sidebar;
}

async function enumerateFiles(dir, pathArray, fileCallback) {
  // dir: The starting directory
  // pathArray: The array of path entries
  // fileCallback: Function to invoke when a file is found
  // When a callback is invoked the following is passed:
  // - file: Which is the file and it's preceeding path. A relative path to a specific file.
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

async function createIfDirAbsent(file) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file);
  }
}
