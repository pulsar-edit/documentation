function instanceMethodAnchor (text) {
  return `#instance-${simplifyLabel(text)}`
}

function classMethodAnchor (text) {
  return `#class-${simplifyLabel(text)}`
}

function simplifyLabel(str) {
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9]/gi, "_");
  return str;
}

module.exports = {
  instanceMethodAnchor,
  classMethodAnchor,
  simplifyLabel
};
