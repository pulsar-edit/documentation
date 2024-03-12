const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../_dist/hovercards");
let emptyHovercards = 0;
let emptyHovercardsValues = [];
/*
Hovercard Format:
  Within each file, named after the hovercard value, will be the following data:
    - description: A text based description of the hovercard
    - title: The title of the Hovercard
    - link: A link to the resource or more information
    - value: The original value
*/

module.exports =
async function resolve() {
  const HOVERCARDS = JSON.parse(fs.readFileSync("hovercard_list.json", { encoding: "utf8" }));

  const hovercard_documents = [];

  for (let i = 0; i < HOVERCARDS.length; i++) {
    let doc = await resolveHovercard(HOVERCARDS[i]);
    hovercard_documents.push(doc);
  }

  await createIfDirAbsent(OUT);

  for (let i = 0; i < hovercard_documents.length; i++) {
    console.log(`[hovercard] Writing ${path.relative(process.cwd(), path.join(OUT, `${hovercard_documents[i].title}.json`))}`);
    fs.writeFileSync(path.join(OUT, `${hovercard_documents[i].value}.json`), JSON.stringify(hovercard_documents[i]), { encoding: "utf8" });
  }

  if (emptyHovercards > 0) {
    console.log(`There are '${emptyHovercards}' unresolved hovercard values!`);
    console.log(emptyHovercardsValues);
  }
}

async function resolveHovercard(val) {
  // The resolutions object contains the function order in which to resolve a hovercard value.
  const resolutions = [
    resolveStaticHovercard,
    resolveApiHovercard,
    resolveBundledPackages
  ];

  const emptyHovercard = {
    value: val,
    title: val,
    description: "After looking high and low more information couldn't be found. Please report an issue.",
    link: "https://github.com/pulsar-edit/docs/issues"
  };

  let hovercard = false;
  let resolutionIdx = 0;

  while(hovercard == false && resolutionIdx < resolutions.length) {
    hovercard = await resolutions[resolutionIdx](val);

    resolutionIdx = resolutionIdx + 1;
  }

  if (!hovercard) {
    // we never did find a resolution after checking all possible values
    emptyHovercards = emptyHovercards + 1;
    emptyHovercardsValues.push(val);
    return emptyHovercard;
  } else {
    // we did find a resolution
    return {
      value: val,
      title: hovercard.title,
      description: hovercard.description,
      link: hovercard.link
    };
  }

}

async function resolveStaticHovercard(val) {
  const statics = JSON.parse(fs.readFileSync(path.join(__dirname, "static_hovercards.json"), { encoding: "utf8" }));

  if (statics[val]) {
    return statics[val];
  } else {
    return false;
  }
}

async function resolveApiHovercard(val) {
  const latest = JSON.parse(fs.readFileSync(path.join(__dirname, "../pulsar-api/latest.json"), { encoding: "utf8" })).latest;
  const api = JSON.parse(fs.readFileSync(path.join(__dirname, `../pulsar-api/content/${latest}.json`), { encoding: "utf8" }));

  let resolved = false;
  // First we will attempt to resolve classes
  for (const apiClass in api.classes) {
    let reducedClass = simplifyLabel(apiClass);
    if (reducedClass == val) {
      resolved = {
        value: val,
        title: api.classes[apiClass].name,
        description: api.classes[apiClass].summary,
        link: `/api/pulsar/${latest}/${apiClass}`
      };
      break;
    }

    // Now to attempt to resolve if our value is pointing to a specific function within the class
    // this can usually be discovered if the original text was `Config::get` which means our value is `config__get`
    if (val.includes("_")) {
      let reducedVal = val.split("_").filter((ele) => ele.length !== 0);
      if (reducedVal.length == 2) {
        // this could point to a class and function within the class
        if (reducedClass == reducedVal[0]) {
          // we now must search through the different parts of this class to determine if we can find the second call
          for (let i = 0; i < api.classes[apiClass].classMethods.length; i++) {
            let reducedMethod = simplifyLabel(api.classes[apiClass].classMethods[i].name);
            if (reducedMethod === reducedVal[1]) {
              resolved = {
                value: val,
                title: `${api.classes[apiClass].name}.${api.classes[apiClass].classMethods[i].name}`,
                description: api.classes[apiClass].classMethods[i].summary,
                link: `/api/pulsar/${latest}/${apiClass}#${anchorize(`${api.classes[apiClass].classMethods[i].visibility} ${api.classes[apiClass].classMethods[i].name}`)}`
              };
              break;
            }
          }
          for (let i = 0; i < api.classes[apiClass].instanceMethods.length; i++) {
            let reducedMethod = simplifyLabel(api.classes[apiClass].instanceMethods[i].name);
            if (reducedMethod === reducedVal[1]) {
              resolved = {
                value: val,
                title: `${api.classes[apiClass].name}.${api.classes[apiClass].instanceMethods[i].name}`,
                description: api.classes[apiClass].instanceMethods[i].summary,
                link: `/api/pulsar/${latest}/${apiClass}#${anchorize(`${api.classes[apiClass].instanceMethods[i].visibility} ${api.classes[apiClass].instanceMethods[i].name}`)}`
              };
              break;
            }
          }
          for (let i = 0; i < api.classes[apiClass].classProperties.length; i++) {
            let reducedProp = simplifyLabel(api.classes[apiClass].classProperties[i].name);
            if (reducedProp === reducedVal[1]) {
              resolved = {
                value: val,
                title: `${api.classes[apiClass].name}.${api.classes[apiClass].classProperties[i].name}`,
                description: api.classes[apiClass].classProperties[i].summary,
                link: `/api/pulsar/${latest}/${apiClass}#${anchorize(`${api.classes[apiClass].classProperties[i].visibility} ${api.classes[apiClass].classProperties[i].name}`)}`
              };
              break;
            }
          }
          for (let i = 0; i < api.classes[apiClass].instanceProperties.length; i++) {
            let reducedProp = simplifyLabel(api.classes[apiClass].instanceProperties[i].name);
            if (reducedProp === reducedVal[1]) {
              resolved = {
                value: val,
                title: `${api.classes[apiClass].name}.${api.classes[apiClass].instanceProperties[i].name}`,
                description: api.classes[apiClass].instanceProperties[i].summary,
                link: `/api/pulsar/${latest}/${apiClass}#${anchorize(`${api.classes[apiClass].instanceProperties[i].visibility} ${api.classes[apiClass].instanceProperties[i].name}`)}`
              };
              break;
            }
          }
        }
      } else if (reducedVal.length === 1) {
        // After removing the underscores from the text, our length is only one.
        // This commonly happens if our original string was `::AbortTransaction`
        // which would imply it's documenting a method that was contextually linked to the
        // document it came from. Unfortunately we can't retroactively discover that context.
        // Meaning our possible only shot is to scan all items and see if this is unique.
        // Or TODO see if we can include some contextual information, although very unlikely.
      }
    }
  }

  return resolved;
}

async function resolveBundledPackages(val) {
  const bundledPackages = fs.readdirSync(path.join(__dirname, "../pulsar/packages"));

  let resolved = false;

  for (const pack of bundledPackages) {
    let reducedPack = simplifyLabel(pack);
    if (reducedPack == val) {
      let data = JSON.parse(fs.readFileSync(path.join(__dirname, "../pulsar/packages", pack, "package.json"), { encoding: "utf8" }));

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

async function createIfDirAbsent(file) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file);
  }
}

function simplifyLabel(str) {
  let newStr = str;
  newStr = newStr.toLowerCase();
  newStr = newStr.replace(/[^a-z0-9]/gi, "_");
  return newStr;
}

function anchorize(str) {
  let newStr = str;
  newStr = newStr.toLowerCase();
  newStr = newStr.replace(/\W/g, "-");
  return newStr;
}
