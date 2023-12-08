const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const data = text.split("\n");

const digits = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const numbers = Object.values(digits);
const names = Object.keys(digits);

let total = 0;
data.forEach((str) => {
  const values = [];
  for (var i = 0; i < str.length; i++) {
    const char = str[i];
    const isNumber = numbers.includes(parseInt(char));
    if (isNumber) {
      values.push(parseInt(char));
      continue;
    }
    const restOfstring = str.slice(i);

    names.forEach((name) => {
      if (restOfstring.startsWith(name)) {
        values.push(digits[name]);
      }
    });
  }

  const value = parseInt(`${values[0]}${values[values.length - 1]}`);
  total += value;
});

console.log(total);
