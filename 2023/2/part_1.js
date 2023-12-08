const fs = require("fs");

const LIMITS = {
  red: 12,
  green: 13,
  blue: 14,
};

const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const getGameId = (row) => {
  // get game ID from a string that starts like this `Game 1: `
  return parseInt(row.split(" ")[1]);
};

const getGameIdIfValid = (row) => {
  let isValid = true;

  const games = row
    .split(": ")[1]
    .split(";")
    .map((game) =>
      game
        .trim()
        .split(",")
        .map((entry) => {
          const [valueStr, key] = entry.trim().split(" ");
          return [key, parseInt(valueStr)];
        })
    );

  games.flat().forEach(([color, count]) => {
    if (!isValid) {
      return;
    }
    const max = LIMITS[color];
    if (count > max) {
      isValid = false;
    }
  });
  if (isValid) {
    return getGameId(row);
  }
  return 0;
};

let total = 0;

rows.forEach((row) => {
  total += getGameIdIfValid(row);
});

console.log(total);
// 2085
