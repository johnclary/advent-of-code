const fs = require("fs");
const text = fs.readFileSync("input.txt", "utf8");
const rows = text.split("\n");

const cardValues = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
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
  // given two arrays of cards objects (["A", "K", ...])
  // return 1 if 'a' set is higher of -1 if 'b' set is higher
  if (shouldSort) {
    // implemented this for part one before realizing its unnecesary
    a.sort(sortCardArrayCards).map((card) => cardValues.indexOf(card));
    b.sort(sortCardArrayCards).map((card) => cardValues.indexOf(card));
  }

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
  const debug = a.raw === "25J79" && b.raw === "25A7Q";
  return compareCardArrays(a.raw.split(""), b.raw.split(""), false, debug);
};

/**
 * Compare hands for sorting weakest -> strongest
 */
const compareHands = (a, b) => {
  if (a.type !== b.type) {
    // different hand types, we can use the simple hand values
    return handValues.indexOf(a.type) - handValues.indexOf(b.type);
  }
  const handType = a.type;

  // same hand type - must compare card values :/
  if (handType === "five_of_a_kind") {
    // compare one card against the other
    const cardA = Object.keys(a.counts)[0];
    const cardB = Object.keys(b.counts)[0];
    return cardValues.indexOf(cardA) - cardValues.indexOf(cardB);
  } else if (handType === "quads") {
    const aCard = a.countArray.find(({ card, count }) => count === 4);
    const bCard = b.countArray.find(({ card, count }) => count === 4);
    const aCardValue = cardValues.indexOf(aCard.card);
    const bCardValue = cardValues.indexOf(bCard.card);
    if (aCardValue !== bCardValue) {
      // different quad card, so no further compare needed
      return aCardValue - bCardValue;
    }
    // compare kicker card
    const kickerA = a.countArray.find(({ card, count }) => count === 1);
    const kickerB = b.countArray.find(({ card, count }) => count === 1);
    return cardValues.indexOf(kickerA.card) - cardValues.indexOf(kickerB.card);
  } else if (handType === "full_house") {
    const aCard = a.countArray.find(({ card, count }) => count === 3);
    const bCard = b.countArray.find(({ card, count }) => count === 3);
    const aCardValue = cardValues.indexOf(aCard.card);
    const bCardValue = cardValues.indexOf(bCard.card);
    if (aCardValue !== bCardValue) {
      // different trip card, so no further compare needed
      return aCardValue - bCardValue;
    }
    // compare pair
    const kickerA = a.countArray.find(({ card, count }) => count === 2);
    const kickerB = b.countArray.find(({ card, count }) => count === 2);
    return cardValues.indexOf(kickerA.card) - cardValues.indexOf(kickerB.card);
  } else if (handType === "trips") {
    const aCard = a.countArray.find(({ card, count }) => count === 3);
    const bCard = b.countArray.find(({ card, count }) => count === 3);
    const aCardValue = cardValues.indexOf(aCard.card);
    const bCardValue = cardValues.indexOf(bCard.card);
    if (aCardValue !== bCardValue) {
      // different trip card, so no further compare needed
      return aCardValue - bCardValue;
    }
    // compare remaining unpaird two cards
    return compareCardArrays(
      a.countArray.filter((card) => card.count === 1).map((card) => card.card),
      b.countArray.filter((card) => card.count === 1).map((card) => card.card),
      true
    );
  } else if (handType === "two_pair" || handType === "one_pair") {
    // first compare paired hands
    const aPairedCards = a.countArray
      .filter(({ card, count }) => count === 2)
      .map((card) => card.card);
    const bPairedCards = b.countArray
      .filter(({ card, count }) => count === 2)
      .map((card) => card.card);
    const pairCompareResult = compareCardArrays(
      aPairedCards,
      bPairedCards,
      true
    );

    if (pairCompareResult === 0) {
      // same one or two pair! so compare remaining cards
      const kickersA = a.countArray
        .filter(({ card, count }) => count === 1)
        .map((card) => card.card);
      const kickersB = b.countArray
        .filter(({ card, count }) => count === 1)
        .map((card) => card.card);
      return compareCardArrays(kickersA, kickersB, true);
    }
    return pairCompareResult;
  } else {
    // compare high card
    return compareCardArrays(
      a.countArray.map((card) => card.card),
      b.countArray.map((card) => card.card),
      true
    );
  }
};

const getCardCountArray = (counts) => {
  // construct an array of card name + counts which will make sorting easier
  const arr = [];
  Object.keys(counts).forEach((card) => {
    arr.push({ card, count: counts[card] });
  });
  return arr;
};

/**
 * Sort hand cards descending. so `2ATK3` becomes `AKT32`
 */
const sortHandCards = (hand) => {
  const cardArray = hand.raw.split("").sort((a, b) => {
    return cardValues.indexOf(b) - cardValues.indexOf(a);
  });
  hand.raw = cardArray.join("");
};

function main(rows) {
  const hands = [];
  rows.forEach((row) => {
    const [handRaw, bid] = row.split(" ");
    // parse hand data and assign hand type
    const hand = { raw: handRaw, counts: getCardCounts(handRaw) };
    hand.countArray = getCardCountArray(hand.counts);
    hand.type = getHandType(hand.counts);
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
// 249463010 <- wrong (using sorting)
// 249844775 <- wrong (using no sorting)
// 249833827 <- wrong (really using no sorting)
// 250298902 <- wron gjc
// 250453939