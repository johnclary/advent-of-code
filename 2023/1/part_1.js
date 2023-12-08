const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const data = text.split("\n");

let total = 0;
data.forEach((str) => {
  // extract numbers from each row of characters
  const digits = str
    .split("")
    .filter((f) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(parseInt(f)));
  // join the first and last and parse as an int
  const value = parseInt(`${digits[0]}${digits[digits.length - 1]}`);
  // add them up
  total += value;
});

console.log(total);
