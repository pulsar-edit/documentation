const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../_dist/hovercards");
let emptyHovercards = 0;

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
  }
}

async function resolveHovercard(val) {
  // The resolutions object contains the function order in which to resolve a hovercard value.
  const resolutions = [
    resolveStaticHovercard
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

async function createIfDirAbsent(file) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(file);
  }
}
