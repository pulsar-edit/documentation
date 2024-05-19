const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const mdRender = require("./md.js");

const LAYOUT_DIR = path.resolve(__dirname, "../../layouts/api");
const ROOT_LAYOUT_DIR = path.resolve(__dirname, "../../layouts");

function convert(name, content, version) {

  let file = "";
  // Metadata available to Markdown plugins.
  let env = { type: 'api', name, content };

  for (const section of content.sections) {
    file += `<h3 class="section-name" id="${anchorize(section.name)}">${section.name}</h3>`;
    file += lookupSection(section.name, "classProperties", content, env);
    file += lookupSection(section.name, "classMethods", content, env);
    file += lookupSection(section.name, "instanceProperties", content, env);
    file += lookupSection(section.name, "instanceMethods", content, env);
  }

  file += lookupNullSections(content, env, content.sections.length > 0);

  file = `
    <h2 id="api-documentation">API documentation</h2>
    ${file}
  `;

  const render = ejs.render(
    getTemplate("page"),
    {
      title: name,
      content,
      file,
      version,
      mdRender: (content) => mdRender(content, env),
      // We don't need explicit sections in the sidebar nav — we can build it
      // dynamically with `AutoTOC`.
      sidebar: [],
      anchorize
    },
    {
      views: [ ROOT_LAYOUT_DIR ],
    }
  );

  return render;
}

function lookupSection(sectionName, prop, content, env) {
  let items = content[prop];

  if (!Array.isArray(items) || items.length < 1) {
    return "";
  }

  let foundItems = items.filter(item => {
    return item.sectionName === sectionName;
  });

  return renderSection(prop, foundItems, env);
}

function lookupNullSections(content, env, hasOtherSections) {
  // Originally this directive in the Atom docs would only grab uncategorized methods
  // but we will look for everything
  let nullClassMethods = content.classMethods.filter((ele) => ele.sectionName === null);
  let nullInstanceMethods = content.instanceMethods.filter((ele) => ele.sectionName === null);
  let nullClassProperties = content.classProperties.filter((ele) => ele.sectionName === null);
  let nullInstanceProperties = content.instanceProperties.filter((ele) => ele.sectionName === null);

  let totalCount = nullClassProperties.length + nullInstanceMethods.length + nullClassProperties.length + nullInstanceProperties.length;
  if (totalCount === 0) return "";

  let file = "";
  let sectionName = hasOtherSections ? 'Other methods' : 'All methods'
  file += `<h3 data-count="${totalCount}" class="section-name" id="${anchorize(sectionName)}">${sectionName}</h3>`;
  file += renderSection("classMethods", nullClassMethods, env);
  file += renderSection("instanceMethods", nullInstanceMethods, env);
  file += renderSection("classProperties", nullClassProperties, env);
  file += renderSection("instanceProperties", nullInstanceProperties, env);

  return file;
}

function renderSection(prop, content, env) {
  if (!env) {
    throw new Error('The `env` argument must be present!');
  }
  let classOrInstance = "class";
  if (prop.startsWith("instance")) {
    classOrInstance = "instance";
  }
  const file = ejs.render(
    getTemplate(prop),
    {
      content: content,
      mdRender: (content) => mdRender(content, env),
      anchorize: (name) => anchorize(`${classOrInstance} ${name}`)
    },
    {
      views: [ LAYOUT_DIR ]
    }
  );

  return file;
}

function getTemplate(name) {
  return fs.readFileSync(
    path.join(LAYOUT_DIR, `${name}.ejs`),
    { encoding: "utf8" }
  );
}

function anchorize(content) {
  let str = content.toLowerCase();
  str = str.replace(/\W/g, "-");
  return str;
}

module.exports = convert;
