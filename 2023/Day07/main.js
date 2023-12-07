import { getData, getPath, count, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/puzzle_input`;

function parser(input) {
    return input.split('\n').map((line) => {
        var [hand, bid] = line.split(' ');
        return [hand.split(''), Number(bid)];
    });
}

var FIVE_OF_A_KIND = 7,
    FOUR_OF_A_KIND = 6,
    FULL_HOUSE = 5,
    THREE_OF_A_KIND = 4,
    TWO_PAIRS = 3,
    ONE_PAIR = 2,
    HIGH_CARD = 1;

function getHandTypeWithJokers(hand, cardMap) {
    var jokers = count('J', hand);
    var handWithoutJokers = hand.filter((card) => card !== 'J');
    var handType = getHandType(handWithoutJokers, cardMap);

    if (handType === FOUR_OF_A_KIND && jokers === 1) return FIVE_OF_A_KIND;
    if (handType === THREE_OF_A_KIND && jokers === 2) return FIVE_OF_A_KIND;
    if (handType === THREE_OF_A_KIND && jokers === 1) return FOUR_OF_A_KIND;
    if (handType === TWO_PAIRS && jokers === 1) return FULL_HOUSE;
    if (handType === ONE_PAIR && jokers === 3) return FIVE_OF_A_KIND;
    if (handType === ONE_PAIR && jokers === 2) return FOUR_OF_A_KIND;
    if (handType === ONE_PAIR && jokers === 1) return THREE_OF_A_KIND;

    if (jokers > 3) return FIVE_OF_A_KIND;
    if (jokers === 3) return FOUR_OF_A_KIND;
    if (jokers === 2) return THREE_OF_A_KIND;
    if (jokers === 1) return ONE_PAIR;

    return handType;
}

function getHandType(hand, cardMap) {
    var equals = (cnt) => (val) => cnt === val;
    var values = Array(cardMap.length).fill(0);
    hand.forEach((card) => (values[cardMap.indexOf(card)] += 1));

    if (values.some(equals(5))) return FIVE_OF_A_KIND;
    if (values.some(equals(4))) return FOUR_OF_A_KIND;
    if (values.some(equals(3)) && values.some(equals(2))) return FULL_HOUSE;
    if (values.some(equals(3))) return THREE_OF_A_KIND;
    if (values.filter(equals(2)).length === 2) return TWO_PAIRS;
    if (values.filter(equals(2)).length === 1) return ONE_PAIR;
    return HIGH_CARD;
}

function sortByCardValues([c1, ...r1], [c2, ...r2], cardMap) {
    return c1 !== c2 ? cardMap.indexOf(c2) - cardMap.indexOf(c1) : sortByCardValues(r1, r2, cardMap);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1HandsSorted = [...data].sort(([hand1], [hand2]) => {
    var cardMap = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    var type1 = getHandType(hand1, cardMap);
    var type2 = getHandType(hand2, cardMap);
    return type1 === type2 ? sortByCardValues(hand1, hand2, cardMap) : type1 - type2;
});

var p2HandsSorted = [...data].sort(([hand1], [hand2]) => {
    var cardMap = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];
    var type1 = getHandTypeWithJokers(hand1, cardMap);
    var type2 = getHandTypeWithJokers(hand2, cardMap);
    return type1 === type2 ? sortByCardValues(hand1, hand2, cardMap) : type1 - type2;
});

console.log('Part 1:', sum(p1HandsSorted.map(([_, bid], idx) => bid * (idx + 1)))); // 250453939
console.log('Part 2:', sum(p2HandsSorted.map(([_, bid], idx) => bid * (idx + 1)))); // 248652697
