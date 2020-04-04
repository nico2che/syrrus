const TYPE = {
  FOLDER: 1,
  FILE: 2
};

function FGDescription(encoded) {
  const matches = encoded.match(/<p>(.*?)<\/p>/);
  if (!matches[1]) {
    return;
  }
  return Buffer.from(matches[1], "base64").toString();
}

const createPath = (obj, path, line) => {
  let folders = path.split("/");
  const file = folders.pop();
  if (!file || file[0] === ".") {
    return obj;
  }
  let current = obj;
  while (folders.length) {
    const name = folders.shift();
    let children = current.children.find(c => c.name === name);
    if (!children) {
      children = {
        id: name,
        type: TYPE.FOLDER,
        name,
        children: []
      };
      current.children.push(children);
    }
    current = children;
  }
  current.children.push({
    id: line,
    type: TYPE.FILE,
    name: file
  });
  return obj;
};

module.exports = { createPath, FGDescription };
