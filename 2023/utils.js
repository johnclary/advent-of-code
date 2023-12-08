const fs = require("fs");

function getInput() {
  return fs.readFileSync("input.txt", "utf8");
}

module.exports = {
  getInput,
};
