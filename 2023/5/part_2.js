const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const mapValue = (maps, destName, sourceName, initValue) => {
  let currDest = destName;
  let currValue = initValue;

  while (true) {
    const map = maps.find((map) => map.dest === currDest);

    const rangeToUse = map.maps.find(
      (range) => currValue >= range[1][0] && currValue < range[1][1]
    );

    if (rangeToUse) {
      const [sourceRange, destRange] = rangeToUse;
      // map the source value!
      currValue = currValue - destRange[0] + sourceRange[0];
    } else {
      // if range then currVaue is unchanged
    }
    // update range source
    currDest = map.source;

    if (currDest === sourceName) {
      // we are done!
      break;
    }
  }
  return currValue;
};

const isInSeedRanges = (value, seedRanges) => {
  return seedRanges.some((range) => range[0] <= value && range[1] > value);
};

function main(rows) {
  // convert seeds to ranges
  const seeds = rows
    .splice(0, 1)[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((str) => parseInt(str));

  const seedRanges = [];
  while (seeds.length > 0) {
    const [start, length] = seeds.splice(0, 2);
    seedRanges.push([start, start + length]);
  }

  //   sort the seeds so it's easier to look at them
  seedRanges.sort(function (a, b) {
    return a[0] - b[0];
  });

  const maps = [];

  // parse maps
  let currentMap;
  rows.forEach((row) => {
    if (row.indexOf("map") > -1) {
      // save prev map
      if (currentMap) {
        maps.push(currentMap);
      }
      // create new map entry
      const [source, , dest] = row.split(" ")[0].split("-");
      currentMap = { source, dest, maps: [] };
      return;
    }
    // parse range and add to maps
    const [destStart, sourceStart, length] = row
      .split(" ")
      .map((x) => parseInt(x));
    currentMap.maps.push([
      [sourceStart, sourceStart + length],
      [destStart, destStart + length],
    ]);
  });
  //  save the last map
  maps.push(currentMap);

  let locationValue = 0;
  let incrementSize = 500;
  while (true) {
    const locationAsSeed = mapValue(maps, "location", "seed", locationValue);
    console.log(locationValue, locationAsSeed);
    if (isInSeedRanges(locationAsSeed, seedRanges)) {
      console.log(
        `found location value ${locationValue} at increment size ${incrementSize}`
      );
      if (incrementSize === 1) {
        // needle in a haystack?
        return locationValue;
      }
      // reduce the increment size and wind back the location Value
      locationValue = locationValue - (incrementSize + 1);
      incrementSize = Math.round(incrementSize / 2)
      continue
    }
    locationValue += incrementSize;
  }
}

const result = main(rows.filter((x) => x !== ""));
console.log(`✨${result}✨`);
// 15880236
