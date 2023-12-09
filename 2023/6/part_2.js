const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

// For each whole millisecond you spend at the beginning of the race holding
// down the button, the boat's speed increases by one millimeter per millisecond

function main(rows) {
  const [targetTime, targetDistance] = rows.map((row) =>
    parseInt(row.split(":")[1].trim().replaceAll(" ", ""))
  );

  let waysToWin = 0;

  let chargeTimeAdjust = 47125000;
  let chargeTime = 0 + chargeTimeAdjust;
  let travelTime = 0;
  let isInWinZone = false;

  /**
   * This charge time vs travel time is a parabolic function.
   * you could solve with with arithmetic if you paid attention
   * in school. or you can use your debugger to figure out
   * when the charge time value is within the part of the 
   * parabola that cooresponds with winning this fictional
   * race
   */
  let increment = 1;
  while (chargeTime <= targetTime) {
    console.log(chargeTime, travelTime);
    travelTime = targetTime - chargeTime;
    if (chargeTime * travelTime > targetDistance) {
      if (!isInWinZone) {
        console.log("you are now in the win zone. take note of the current chargeTime");
        isInWinZone = true;
        debugger;
      }
      waysToWin++;
    } else {
      if (isInWinZone) {
        console.log("you have left the win zone. take note of the current chargeTime");
        isInWinZone = false;
        debugger;
      }
    }
    chargeTime += increment;
  }
  return waysToWin;
}

const result = main(rows);
console.log(`✨ ${result} ✨`);
// ✨ 34454850 ✨
