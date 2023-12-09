const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

// For each whole millisecond you spend at the beginning of the race holding
// down the button, the boat's speed increases by one millimeter per millisecond

function main(rows) {
  const [times, distances] = rows.map((row) =>
    row
      .split(":")[1]
      .trim()
      .split(" ")
      .filter((x) => x)
      .map((num) => parseInt(num))
  );

  const waysToWinAll = [];

  for (var i = 0; i < times.length; i++) {
    let waysToWin = 0;
    const targetTime = times[i];
    const targetDistance = distances[i];
    let chargeTime = 0;
    let travelTime = 0;
    while (chargeTime <= targetTime) {
      travelTime = targetTime - chargeTime;
      if (chargeTime * travelTime > targetDistance) {
        // this is success
        console.log(chargeTime, travelTime, chargeTime * travelTime);
        waysToWin++;
      }
      chargeTime++;
    }
    waysToWinAll.push(waysToWin);
  }
  return waysToWinAll.reduce((total, value) => total * value, 1);
}

const result = main(rows);
console.log(`✨ ${result} ✨`);
// ✨ 220320 ✨