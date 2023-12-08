const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

// the destination range start, the source range start, and the range length.

const mapValue = (maps, sourceName, destName, initValue) => {
  let currSource = sourceName;
  let currValue = initValue;

  while (true) {
    const map = maps.find((map) => map.source === currSource);

    const rangeToUse = map.maps.find(
      (range) => currValue >= range[0][0] && currValue < range[0][1]
    );

    if (rangeToUse) {
      const [sourceRange, destRange] = rangeToUse;
      // map the source value!
      currValue = currValue - sourceRange[0] + destRange[0];
    } else {
      // if range then currVaue is unchanged
    }
    // update range source
    currSource = map.dest;

    if (currSource === destName) {
      // we are done!
      break;
    }
  }
  return currValue;
};

function main(rows) {
  // convert seeds to array
  const seeds = rows
    .splice(0, 1)[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((str) => parseInt(str));

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

  console.dir(maps, { depth: null });

  const seedLocations = seeds.map((seed) =>
    mapValue(maps, "seed", "location", seed)
  );
  return Math.min(...seedLocations);
}

const result = main(rows.filter((x) => x !== ""));
console.log(`✨${result}✨`);
