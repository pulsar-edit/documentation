const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const mdRender = require("./md.js");

module.exports =
async function convert(name, content) {

  let file = "";

  for await (const section of content.sections) {
    file += `<h3 id="${anchorize(section.name)}">${section.name}</h3>`;
    file += await lookupSection(section.name, "classProperties", content);
    file += await lookupSection(section.name, "classMethods", content);
    file += await lookupSection(section.name, "instanceProperties", content);
    file += await lookupSection(section.name, "instanceMethods", content);
  }

  file += await lookupNullSections(content);

  const render = await ejs.render(
    getTemplate("page"),
    {
      title: name,
      content: content,
      file: file,
      mdRender: mdRender,
      sidebar: sections2sidebar(content.sections, name),
      anchorize: anchorize
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
  const file = await renderSection(prop, foundItems);

  return file;
}

async function lookupNullSections(content) {
  // Originally this directive in the Atom docs would only grab uncategorized methods
  // but we will look for everything
  let nullClassMethods = content.classMethods.filter((ele) => ele.sectionName === null);
  let nullInstanceMethods = content.instanceMethods.filter((ele) => ele.sectionName === null);
  let nullClassProperties = content.classProperties.filter((ele) => ele.sectionName === null);
  let nullInstanceProperties = content.instanceProperties.filter((ele) => ele.sectionName === null);

  // now to render these items
  let file = "";
  file += await renderSection("classMethods", nullClassMethods);
  file += await renderSection("instanceMethods", nullInstanceMethods);
  file += await renderSection("classProperties", nullClassProperties);
  file += await renderSection("instanceProperties", nullInstanceProperties);

  return file;
}

async function renderSection(prop, content) {
  const file = await ejs.render(
    getTemplate(prop),
    {
      content: content,
      mdRender: mdRender,
      anchorize: anchorize
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

function sections2sidebar(sections, pageRoot) {
  // Converts a sections array into valid sidebar data
  let sidebar = [];

  for (let i = 0; i < sections.length; i++) {
    sidebar.push({
      text: sections[i].name,
      summary: mdRender(sections[i].description),
      link: `${pageRoot}#${anchorize(sections[i].name)}`
    });
  }

  return sidebar;
}

function anchorize(content) {
  let str = content.toLowerCase();
  str = str.replace(/\W/g, "-");
  return str;
}
