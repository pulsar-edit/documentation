const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const md = require("../../plugins/markdown-it.js");

module.exports =
async function convert(name, content) {

  let file = "";

  for await (const section of content.sections) {
    file += `<h3>${section.name}</h3>`;
    file += await lookupSection(section.name, "classProperties", content);
    file += await lookupSection(section.name, "classMethods", content);
    file += await lookupSection(section.name, "instanceProperties", content);
    file += await lookupSection(section.name, "instanceMethods", content);
  }

  const render = await ejs.render(
    getTemplate("page"),
    {
      title: name,
      md_summary: md.render(content.summary),
      md_description: md.render(content.description),
      content: content,
      file: file
    },
    {
      views: [ path.resolve(__dirname, "../../layouts") ],
    }
  );

  return render;
}

async function lookupSection(sectionName, prop, content) {
  let item = content[prop];

  if (!Array.isArray(item) || item.length < 1) {
    return "";
  }

  let foundItems = [];

  for (let i = 0; i < item.length; i++) {
    if (item[i].sectionName == sectionName) {
      foundItems.push(item[i]);
    }
  }

  // now prior to rendering we want to render the markdown content within each one
  for (let i = 0; i < foundItems.length; i++) {
    foundItems[i].md_summary = md.render(foundItems[i].summary);
    foundItems[i].md_description = md.render(foundItems[i].description);
  }

  // now to render these items
  const file = await ejs.render(
    getTemplate(prop),
    {
      content: foundItems
    },
    {
      views: [ path.resolve(__dirname, "../layouts") ]
    }
  );

  return file;
}

function getTemplate(name) {
  return fs.readFileSync(path.resolve(__dirname, "../layouts", `${name}.ejs`), { encoding: "utf8" });
}
