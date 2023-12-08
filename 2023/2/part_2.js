const fs = require("fs");

const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const getGamePower = (row) => {
  const sets = row
    .split(": ")[1]
    .split(";")
    .map((set) =>
      set
        .trim()
        .split(",")
        .map((entry) => {
          const [valueStr, key] = entry.trim().split(" ");
          return [key, parseInt(valueStr)];
        })
    );

  const maxValues = { red: 0, green: 0, blue: 0 };

  sets.flat().forEach(([color, count]) => {
    if (count > maxValues[color]) {
      maxValues[color] = count;
    }
  });

  return maxValues.red * maxValues.blue * maxValues.green;
};

let total = 0;

rows.forEach((row) => {
  total += getGamePower(row);
});

console.log(total);
// 79315
