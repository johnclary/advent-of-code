const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

// e.g.
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
function main(rows) {
  let points = 0;
  rows.forEach((row) => {
    const [winNumbers, myNumbers] = row
      .split(":")[1]
      .split("|")
      .map((numStr) =>
        numStr
          .trim()
          .split(" ")
          .filter((x) => x)
          .map((x) => parseInt(x))
      );

    let score = 0;
    myNumbers.forEach((num) => {
      if (winNumbers.includes(num)) {
        // we have a match
        if ((score === 0)) {
          score = 1;
        } else {
          score = score * 2;
        }
      }
    });
    points += score;
  });
  return points;
}

const result = main(rows);
console.log(result);
// 26218
