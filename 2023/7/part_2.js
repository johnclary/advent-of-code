const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const cardValues = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

const handValues = [
  "high_card",
  "one_pair",
  "two_pair",
  "trips",
  "full_house",
  "quads",
  "five_of_a_kind",
];

/**
 * Construct object of card names with their frequency
 */
const getCardCounts = (handRaw) =>
  handRaw.split("").reduce((counts, card) => {
    counts[card] ??= 0;
    counts[card]++;
    return counts;
  }, {});

/**
 * Assign hand type based on card frequency
 */
const getHandType = (counts) => {
  const cards = Object.keys(counts);
  const frq = Object.values(counts);
  if (cards.length === 5) {
    return "high_card";
  } else if (cards.length === 4) {
    return "one_pair";
  } else if (cards.length === 3) {
    // trips or two pair or: AAKK3, AAAK3
    if (frq.includes(3)) {
      return "trips";
    } else {
      return "two_pair";
    }
  } else if (cards.length === 2) {
    // quads or full house: AAAAK, AAAKK
    if (frq.includes(4)) {
      return "quads";
    } else {
      return "full_house";
    }
  } else {
    return "five_of_a_kind";
  }
};

const sortCardArrayCards = (a, b) =>
  cardValues.indexOf(b.card) - cardValues.indexOf(a.card);

const compareCardArrays = (a, b, shouldSort, debug) => {
  // given two arrays of cards (["A", "K", ...])
  // return 1 if 'a' set is higher of -1 if 'b' set is higher
  const aValues = a.map((card) => cardValues.indexOf(card));
  const bValues = b.map((card) => cardValues.indexOf(card));
  let aIsHigher = 0;

  aValues.forEach((value, i) => {
    if (aIsHigher !== 0) {
      // stop processing cards
      return;
    }
    if (value < bValues[i]) {
      aIsHigher = -1;
    } else if (value > bValues[i]) {
      aIsHigher = 1;
    }
  });

  return aIsHigher;
};

const compareHandsJanky = (a, b) => {
  if (a.type !== b.type) {
    // different hand types, we can use the simple hand values
    return handValues.indexOf(a.type) - handValues.indexOf(b.type);
  }
  // compare cards
  const debug = false;
  return compareCardArrays(a.raw.split(""), b.raw.split(""), false, debug);
};

const handleJacksWild = (hand) => {
  if (!hand.counts.J) {
    return;
  }
  if (hand.type === "high_card") {
    // must be a pair now, since there was no pair before
    hand.type = "one_pair";
    hand.adjusted_from = "high_card";
  } else if (hand.type === "one_pair") {
    if (hand.counts.J === 1) {
      hand.type = "trips";
      hand.adjusted_from = "one_pair";
    } else if (hand.counts.J === 2) {
      hand.type = "trips";
      hand.adjusted_from = "one_pair";
    }
  } else if (hand.type === "two_pair") {
    if (hand.counts.J === 1) {
      hand.type = "full_house";
      hand.adjusted_from = "two_pair";
    } else if (hand.counts.J === 2) {
      hand.type = "quads";
      hand.adjusted_from = "two_pair";
    }
  } else if (hand.type === "trips") {
    if (hand.counts.J === 1) {
      hand.type = "quads";
      hand.adjusted_from = "trips";
    } else if (hand.counts.J === 3) {
      hand.type = "quads";
      hand.adjusted_from = "trips";
    }
  } else if (hand.type === "full_house" || hand.type === "quads") {
    hand.adjusted_from = hand.type;
    hand.type = "five_of_a_kind";
  }
  console.log("adjusted a ", hand.adjusted_from, hand.type);
};

function main(rows) {
  const hands = [];
  rows.forEach((row) => {
    const [handRaw, bid] = row.split(" ");
    // parse hand data and assign hand type
    const hand = { raw: handRaw, counts: getCardCounts(handRaw) };
    hand.type = getHandType(hand.counts);
    handleJacksWild(hand);
    hand.bid = parseInt(bid);
    // sort the raw hand cards, which will be useful for debugging
    // sortHandCards(hand);
    hands.push(hand);
  });
  //   hands.sort(compareHands);
  hands.sort(compareHandsJanky);
  console.log(hands.map((h) => h.raw).join("\n"));
  let total = 0;
  hands.forEach((hand, i) => {
    total = total + hand.bid * (i + 1);
  });

  return total;
}

const result = main(rows);
console.log(`✨ ${result} ✨`);
// 248652697
