const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const convert = require("./json2html.js");

const IN = path.join(__dirname, "../content");
const OUT = path.join(__dirname, "../../_pulsar-api");

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

  for (let item in objs) {

    await createIfDirAbsent(path.join(OUT, item));

    // Lets create the summary page
    let summaryHTML = await ejs.render(
      fs.readFileSync(path.resolve(__dirname, "../layouts/summary.ejs"), { encoding: "utf8" }),
      {
        title: item,
        sidebar: JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../docs/docs.11tydata.json"), { encoding: "utf8" })).root_sidebar,
        blocks: content2sidebar(objs[item].classes)
      },
      {
        views: [ path.resolve(__dirname, "../../layouts") ]
      }
    );

    fs.writeFileSync(
      path.join(OUT, item, "index.html"),
      summaryHTML,
      { encoding: "utf8" }
    );

    for (let apiClass in objs[item].classes) {
      let html = await convert(apiClass, objs[item].classes[apiClass]);

      await createIfDirAbsent(path.join(OUT, item, apiClass));

      fs.writeFileSync(
        path.join(OUT, item, apiClass, "index.html"),
        html,
        { encoding: "utf8" }
      );

    }

  }

}

function content2sidebar(content) {
  let sidebar = [];

  for (let item in content) {
    sidebar.push({
      text: content[item].name,
      summary: content[item].summary,
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
