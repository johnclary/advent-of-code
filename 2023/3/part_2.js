const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const numbs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// turn [x, y] array into `x_y` string
const getStringId = (charId) => charId.join("_");

function main(rows) {
  // start by parsing all data into symbols + numbers
  // with each taking the form of [<value>, [<x coord>, <ycoord>]]
  const symbols = [];
  const numbers = [];

  for (var y = 0; y < rows.length; y++) {
    const row = rows[y];
    let currNumberString = "";
    let currNumberIds = [];

    for (var x = 0; x < row.length; x++) {
      const char = row[x];
      const charId = [x, y];

      if (numbs.includes(char)) {
        // accumlate digits to string and update saved values
        currNumberString = `${currNumberString}${char}`;
        currNumberIds.push(charId);
        continue;
      }

      if (char === "*") {
        // its a special symbol - save it
        symbols.push([char, charId]);
      }

      // since we have a symbol or period, we need to save and reset
      currNumberString &&
        numbers.push([parseInt(currNumberString), currNumberIds]);
      currNumberString = "";
      currNumberIds = [];
    }

    // we have to do one last save outside the inner loop
    // in case the line ended with a number
    currNumberString &&
      numbers.push([parseInt(currNumberString), currNumberIds]);
  }

  const gearRationsToSum = [];

  // identify all coordinates that are adjacent to a "*" symbol
  symbols.forEach(([char, [x, y]]) => {
    const touchingXY = [
      // left
      [x - 1, y],
      // right
      [x + 1, y],
      // above
      [x, y - 1],
      // below
      [x, y + 1],
      // bot right
      [x + 1, y + 1],
      // bot left
      [x - 1, y + 1],
      // top left
      [x - 1, y - 1],
      // top right
      [x + 1, y - 1],
    ];
    // stringify each coord ID
    const touchingSymbolIds = touchingXY.map((charId) => getStringId(charId));

    const allAdjacentNumberIds = [];

    numbers.forEach(([num, charIds]) => {
      if (allAdjacentNumberIds.length > 2) {
        // already doesn't meet criteria so we can stop
      }
      // test if each number's coords overlaps with each symbols coords
      const isAdjacent = charIds.some((charId) =>
        touchingSymbolIds.includes(getStringId(charId))
      );
      isAdjacent && allAdjacentNumberIds.push(num);
    });
    // calculate gear ratio and save
    if (allAdjacentNumberIds.length === 2) {
      gearRationsToSum.push(allAdjacentNumberIds[0] * allAdjacentNumberIds[1]);
    }
  });

  // sum all gear ratios
  return gearRationsToSum.reduce((prev, val) => prev + val, 0);
}

const result = main(rows);
console.log(result);
// 84159075
