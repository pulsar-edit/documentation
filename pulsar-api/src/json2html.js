const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const md = require("../../plugins/markdown-it.js");

function mdRender(content) {
  return md.render(content);
}

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
      content: content,
      file: file,
      mdRender: mdRender
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

  // now to render these items
  const file = await ejs.render(
    getTemplate(prop),
    {
      content: foundItems,
      mdRender: mdRender
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
