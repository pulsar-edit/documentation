const path = require("path");
const process = require("process");
// Modify files

// Due to the fact that we have an invalid path to our src files (as they are submodules)
// not being run at the root of the repo, it'd be rather difficult to have `pulsardoc`
// via the supported files parameter be correct. So it's best for us to modify it here instead

// We will also modify the `srcUrl` property here as well

const PULSAR_PATH = path.join(__dirname, "../../pulsar");
const PATHWATCHER_PATH = path.join(__dirname, "../../node-pathwatcher");
const KEYMAP_PATH = path.join(__dirname, "../../atom-keymap");
const EVENTKIT_PATH = path.join(__dirname, "../../event-kit");
const SECONDMATE_PATH = path.join(__dirname, "../../second-mate");
const TEXTBUFFER_PATH = path.join(__dirname, "../../text-buffer");

module.exports =
function modify(doc, versions) {
  // Always call resolveSrcUrl first as it relies on the original filename
  for (let apiClass in doc.classes) {
    let apiClassFilePath = doc.classes[apiClass].filename;
    doc.classes[apiClass].srcUrl = resolveSrcUrl(doc.classes[apiClass].srcUrl, apiClassFilePath, versions);
    doc.classes[apiClass].filename = resolveFilename(apiClassFilePath);

    for (section of doc.classes[apiClass].classMethods) {
      section.srcUrl = resolveSrcUrl(section.srcUrl, apiClassFilePath, versions);
    }

    for (section of doc.classes[apiClass].instanceMethods) {
      section.srcUrl = resolveSrcUrl(section.srcUrl, apiClassFilePath, versions);
    }

    for (section of doc.classes[apiClass].classProperties) {
      section.srcUrl = resolveSrcUrl(section.srcUrl, apiClassFilePath, versions);
    }

    for (section of doc.classes[apiClass].instanceProperties) {
      section.srcUrl = resolveSrcUrl(section.srcUrl, apiClassFilePath, versions);
    }
  }
}

function resolveFilename(filename) {

  let newPath;

  if (filename.includes(PULSAR_PATH)) {
    newPath = path.relative(PULSAR_PATH, filename);
  } else if (filename.includes(PATHWATCHER_PATH)) {
    newPath = path.relative(PATHWATCHER_PATH, filename);
  } else if (filename.includes(KEYMAP_PATH)) {
    newPath = path.relative(KEYMAP_PATH, filename);
  } else if (filename.includes(EVENTKIT_PATH)) {
    newPath = path.relative(EVENTKIT_PATH, filename);
  } else if (filename.includes(SECONDMATE_PATH)) {
    newPath = path.relative(SECONDMATE_PATH, filename);
  } else if (filename.includes(TEXTBUFFER_PATH)) {
    newPath = path.relative(TEXTBUFFER_PATH, filename);
  }

  if (process.platform === "win32") {
    newPath = newPath.replace(new RegExp("\\" + path.sep, "g"), "/");
  }

  return newPath;
}

function resolveSrcUrl(srcUrl, filepath, versions) {
  let newUrl;
  let loc = srcUrl.split("#")[1];

  if (filepath.includes(PULSAR_PATH)) {
    newUrl = `https://github.com/pulsar-edit/pulsar/blob/${getVer(versions.pulsar)}/${resolveFilename(filepath)}#${loc}`;
  } else if (filepath.includes(PATHWATCHER_PATH)) {
    newUrl = `https://github.com/pulsar-edit/node-pathwatcher/blob/${getVer(versions.pathwatcher)}/${resolveFilename(filepath)}#${loc}`;
  } else if (filepath.includes(KEYMAP_PATH)) {
    newUrl = `https://github.com/pulsar-edit/atom-keymap/blob/${getVer(versions.keymap)}/${resolveFilename(filepath)}#${loc}`;
  } else if (filepath.includes(EVENTKIT_PATH)) {
    newUrl = `https://github.com/pulsar-edit/event-kit/blob/${getVer(versions.eventkit)}/${resolveFilename(filepath)}#${loc}`;
  } else if (filepath.includes(SECONDMATE_PATH)) {
    newUrl = `https://github.com/pulsar-edit/second-mate/blob/${getVer(versions.secondmate)}/${resolveFilename(filepath)}#${loc}`;
  } else if (filepath.includes(TEXTBUFFER_PATH)) {
    newUrl = `https://github.com/pulsar-edit/text-buffer/blob/${getVer(versions.textbuffer)}/${resolveFilename(filepath)}#${loc}`;
  }

  return newUrl;
}

function getVer(item) {
  return item != null ? `v${item}` : "HEAD";
}
