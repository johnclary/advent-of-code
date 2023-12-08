const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const numbs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = [];
const numbers = [];

// turn [x, y] array into `x_y` string
const getStringId = (charId) => charId.join("_");

function main(rows) {
  for (var y = 0; y < rows.length; y++) {
    const row = rows[y];
    let currNumberString = "";
    let currNumberIds = [];

    for (var x = 0; x < row.length; x++) {
      const char = row[x];
      const charId = [x, y];

      if (numbs.includes(char)) {
        // accumlate digits ito string and update saved values
        currNumberString = `${currNumberString}${char}`;
        currNumberIds.push(charId);
        continue;
      }

      if (char !== ".") {
        // its a symbol - save it
        symbols.push([char, charId]);
      }
      // since we have a symbol or period, we need to save
      // and reset the curr number
      currNumberString &&
        numbers.push([parseInt(currNumberString), currNumberIds]);
      // reset stuff
      currNumberString = "";
      currNumberIds = [];
    }
    // we have to save outside the inner loop in case the line ended with a number
    currNumberString &&
      numbers.push([parseInt(currNumberString), currNumberIds]);
  }

  const allTouchingSymbolIds = [];

  // identify all coordinates that are adjacent to a symbol
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
    // stringify each coord ID and push to the mega array
    const touchingSymbolIds = touchingXY.map((charId) => getStringId(charId));
    allTouchingSymbolIds.push(touchingSymbolIds);
  });

  const uniqueTouchingSymbolIds = [...new Set(allTouchingSymbolIds.flat())];

  // identify all numbers that occupy a symbol
  const partNumbers = numbers
    .filter(([value, charIds]) =>
      // of all coords this number occupies
      charIds.some((charId) =>
        // keep part number if any matches a symbol ID
        uniqueTouchingSymbolIds.includes(getStringId(charId))
      )
    )
    .map(([value, charIds]) => value);

  // add them all up
  return partNumbers.reduce((total, number) => {
    return total + number;
  }, 0);
}

const result = main(rows);
console.log(result);
// not submitted
// 538121
