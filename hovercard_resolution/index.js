const FS = require("fs");
const Path = require("path");
const { classMethodAnchor, instanceMethodAnchor, simplifyLabel } = require('./util');

const rawMdRender = require('../pulsar-api/src/md.js');
function mdRender (content) {
  // The descriptions inside of hovercards may also have {Text} {Like} {This}.
  // We want to render it the way we would elsewhere, but we want to skip the
  // part where we write to disk (the way we did in the earlier phase).
  return rawMdRender(content, { skip_hovercard: true });
}

const CWD = process.cwd();
const OUT = Path.join(__dirname, '..', '_dist', 'hovercards');

let LATEST_API_VERSION;

/*
Hovercard Format:
  Within each file, named after the hovercard value, will be the following data:
    - description: A text based description of the hovercard
    - title: The title of the Hovercard
    - link: A link to the resource or more information
    - value: The original value
*/

// TODO: Hovercards only consider the most recent version.
module.exports =
async function resolve() {
  let emptyHovercards = new Set();
  LATEST_API_VERSION = JSON.parse(
    FS.readFileSync(
      Path.join(__dirname, '..', 'pulsar-api', 'latest.json')
    )
  ).latest;
  let apiData = JSON.parse(
    FS.readFileSync(
      Path.join(__dirname, '..', 'pulsar-api', 'content', `${LATEST_API_VERSION}.json`)
    )
  );
  let hovercards = JSON.parse(FS.readFileSync('hovercard_list.json'));
  let cache = initializeCache(apiData);

  const bundles = [];

  let cards = Object.entries(hovercards);
  for (let [simpleLabel, label] of cards) {
    let doc = await resolveHovercard(simpleLabel, label, cache);
    if (doc.empty) {
      emptyHovercards.add(label);
      continue;
    }
    if (doc.description) {
      doc.description = mdRender(doc.description, { skip_hovercard: true })
    }
    if (typeof doc === "object") {
      doc.value ??= simpleLabel;
    }
    bundles.push(doc);
  }

  await createDirIfAbsent(OUT);

  for (let doc of bundles) {
    let { title, value } = doc;
    if (typeof title !== "string" || title.trim() === "") {
      throw new Error(`Invalid hovercard title: ${JSON.stringify(title)}`);
    }
    let targetPath = Path.join(OUT, `${value}.json`);
    // let relativePath = Path.relative(CWD, targetPath);
    FS.writeFileSync(targetPath, JSON.stringify(doc));
  }

  if (emptyHovercards.size > 0) {
    console.warn(`There are ${emptyHovercards.size} unresolved hovercard values!`);
    for (let emptyValue of Array.from(emptyHovercards).sort()) {
      console.log(emptyValue);
    }
  }
}

async function resolveHovercard(simpleLabel, label, cache) {
  const resolutions = [
    resolveStaticHovercard,
    resolveApiHovercard,
    resolveBundledPackages
  ];

  const emptyHovercard = {
    empty: true,
    value: simpleLabel,
    title: label,
    description: "After looking high and low more information couldn't be found. Please report an issue.",
    link: "https://github.com/pulsar-edit/docs/issues"
  };

  let hovercard = false;

  for (let resolution of resolutions) {
    hovercard = await resolution(simpleLabel, label, cache);
    if (hovercard) break;
  }

  return hovercard || emptyHovercard;
}

let staticHovercards;
async function resolveStaticHovercard(val) {
  staticHovercards ??= JSON.parse(
    FS.readFileSync(Path.join(__dirname, 'static_hovercards.json'))
  );
  return staticHovercards[val] ?? false;
}

function initializeCache (apiData) {
  cacheByLabel = new Map();
  for (const [label, klass] of Object.entries(apiData.classes)) {
    buildCacheForClass(label, klass, cacheByLabel);
  }
  return cacheByLabel;
}

function buildCacheForClass (label, klass, cacheByLabel) {
  let simpleLabel = simplifyLabel(label);
  let baseLink = `/api/pulsar/${LATEST_API_VERSION}/${klass.name}`;

  cacheByLabel.set(label, {
    value: simpleLabel,
    title: klass.name,
    description: klass.summary,
    link: baseLink
  });

  for (let instanceMethod of (klass.instanceMethods ?? [])) {
    let value = `${klass.name}::${instanceMethod.name}`;
    cacheByLabel.set(value, {
      value: simplifyLabel(value),
      title: instanceMethod.customData?.name ?? value,
      description: instanceMethod.summary || (instanceMethod.returnValues?.[0]?.description ?? ""),
      link: `${baseLink}${instanceMethodAnchor(instanceMethod.name)}`
    });
  }

  for (let instanceProperty of (klass.instanceProperties ?? [])) {
    let value = `${klass.name}::${instanceProperty.name}`;
    cacheByLabel.set(value, {
      value: simplifyLabel(value),
      title: instanceProperty.customData?.name ?? value,
      description: instanceProperty.summary ?? "",
      link: `${baseLink}${instanceMethodAnchor(instanceProperty.name)}`
    });
  }

  for (let classMethod of (klass.classMethods ?? [])) {
    let value = `${klass.name}.${classMethod.name}`;

    let bundle = {
      value: simplifyLabel(value),
      title: classMethod.customData?.name ?? value,
      description: classMethod.summary || (classMethod.returnValues?.[0]?.description ?? ""),
      link: `${baseLink}${classMethodAnchor(classMethod.name)}`
    };

    cacheByLabel.set(value, bundle);
  }

  for (let classProperty of (klass.classProperties ?? [])) {
    let value = `${klass.name}::${classProperty.name}`;
    cacheByLabel.set(value, {
      value: simplifyLabel(value),
      title: classProperty.customData?.name ?? value,
      description: classProperty.summary  ?? "",
      link: `${baseLink}${classMethodAnchor(classProperty.name)}`
    });
  }
}

async function resolveApiHovercard(_simpleLabel, label, cache) {
  let cached = cache.get(label)
  if (!cached) return false;
  return { ...cached };
}

let bundledPackages;
async function resolveBundledPackages(val) {
  bundledPackages ??= FS.readdirSync(
    Path.join(__dirname, "../submodules/pulsar/packages")
  );

  let resolved = false;

  for (const pack of bundledPackages) {
    let reducedPack = simplifyLabel(pack);
    if (reducedPack == val) {
      let data = JSON.parse(
        FS.readFileSync(
          Path.join(__dirname, "../submodules/pulsar/packages", pack, "package.json")
        )
      );

      resolved = {
        value: val,
        title: data.name,
        description: data.description,
        link: `https://github.com/pulsar-edit/pulsar/tree/HEAD/packages/${pack}`
      };
      break;
    }
  }

  return resolved;
}

async function createDirIfAbsent(file) {
  if (!FS.existsSync(file)) {
    FS.mkdirSync(file);
  }
}
