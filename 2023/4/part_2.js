const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

function main(rows) {
  // initialize todo list as an array of arrays of [<matches>, <count>]
  const allCards = rows.map((row, index) => {
    // extract winning numbers and numbers to match
    const [winNumbers, numbersToMatch] = row
      .split(":")[1]
      .split("|")
      .map((numStr) =>
        numStr
          .trim()
          .split(" ")
          .filter((x) => x)
          .map((x) => parseInt(x))
      );
    // test each number to match and count # of matches
    let matchCount = 0;
    numbersToMatch.forEach((num) => {
      if (winNumbers.includes(num)) {
        // we have a match
        matchCount++;
      }
    });
    return [matchCount, 1];
  });

  // collect the cards
  for (var i = 0; i < allCards.length; i++) {
    // grab the next card
    const [matchCount, count] = allCards[i];
    // create array of card indices affected by this winning card
    const cardsIdsToCopy = Array.from(Array(matchCount).keys()).map(
      (x) => x + 1 + i
    );
    // for each card that was won
    cardsIdsToCopy.forEach((idx) => {
      // increment it's count by the count of the current card
      allCards[idx][1] += count
    });
  }
  // add it all up
  return allCards.reduce((total, card) => {
    total += card[1];
    return total;
  }, 0);
}

const result = main(rows);
console.log(`✨${result} cards collected✨`);
