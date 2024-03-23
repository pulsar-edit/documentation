const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const mdRender = require("./md.js");

function convert(name, content) {

  let file = "";

  for (const section of content.sections) {
    file += `<h3 class="section-name" id="${anchorize(section.name)}">${section.name}</h3>`;
    file += lookupSection(section.name, "classProperties", content);
    file += lookupSection(section.name, "classMethods", content);
    file += lookupSection(section.name, "instanceProperties", content);
    file += lookupSection(section.name, "instanceMethods", content);
  }

  file += lookupNullSections(content);

  file = `
    <h2>API documentation</h2>
    ${file}
  `;

  const render = ejs.render(
    getTemplate("page"),
    {
      title: name,
      content,
      file,
      mdRender,
      sidebar: sections2sidebar(content.sections, name),
      anchorize,
      sections
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
  const file = renderSection(prop, foundItems);

  return file;
}

function lookupNullSections(content) {
  // Originally this directive in the Atom docs would only grab uncategorized methods
  // but we will look for everything
  let nullClassMethods = content.classMethods.filter((ele) => ele.sectionName === null);
  let nullInstanceMethods = content.instanceMethods.filter((ele) => ele.sectionName === null);
  let nullClassProperties = content.classProperties.filter((ele) => ele.sectionName === null);
  let nullInstanceProperties = content.instanceProperties.filter((ele) => ele.sectionName === null);

  // now to render these items
  let file = "";
  file += renderSection("classMethods", nullClassMethods);
  file += renderSection("instanceMethods", nullInstanceMethods);
  file += renderSection("classProperties", nullClassProperties);
  file += renderSection("instanceProperties", nullInstanceProperties);

  return file;
}

function renderSection(prop, content) {
  const file = ejs.render(
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
  return fs.readFileSync(
    path.resolve(__dirname, "../layouts", `${name}.ejs`),
    { encoding: "utf8" }
  );
}

function sections2sidebar(sections, pageRoot) {
  // Converts a sections array into valid sidebar data
  let sidebar = [];

  for (let i = 0; i < sections.length; i++) {
    let { name, description } = sections[i];
    sidebar.push({
      text: name,
      summary: mdRender(description),
      link: `#${anchorize(name)}`
    })
  }

  return sidebar;
}

function anchorize(content) {
  let str = content.toLowerCase();
  str = str.replace(/\W/g, "-");
  return str;
}

module.exports = convert;
