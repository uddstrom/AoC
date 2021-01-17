const fs = require('fs');

function intersect(...args) {
    const iSect = (a, b) => a.filter((el) => b.includes(el));
    const [first, second, ...rest] = args;
    if (!second) return first;
    if (rest && rest.length > 0) return intersect(iSect(first, second), ...rest);
    return iSect(first, second);
}

function mapIngredientToAllergen(allergens, foods) {
    const mapped = new Map();
    while (allergens.length > 0) {
        const allergen = allergens.shift();
        const foodsWithAllergen = foods.filter(f => f.allergens.includes(allergen));
        const ingredients = intersect(...foodsWithAllergen.map(f => f.ingredients)).filter(i => !mapped.has(i));
        ingredients.length === 1
            ? mapped.set(ingredients[0], allergen)
            : allergens.push(allergen);
    }
    return mapped;
}

function parseFoods(line) {
    const allergens = line.match(/\(contains (.+)\)/)[1].split(', ');
    const ingredients = line.substring(0, line.indexOf(' (')).split(' ');
    return { allergens, ingredients };
}

fs.readFile('Day21/puzzle_input', 'utf8', function (err, contents) {
    const foods = contents.split('\n').map(line => parseFoods(line));
    allergens = [...new Set(foods.map(f => f.allergens).flat(Infinity))];
    ingredients = [...new Set(foods.map(f => f.ingredients).flat(Infinity))];
    const mapping = mapIngredientToAllergen(allergens, foods);

    function countNonAllergenIngredients() {
        const ingredientsWithoutAllergen = ingredients.filter(i => !mapping.has(i));
        return ingredientsWithoutAllergen.reduce((acc, ingredient) =>
            acc + foods.reduce((acc2, f) =>
                f.ingredients.includes(ingredient) ? acc2 + 1 : acc2, 0), 0);
    }

    const canonicalDangerousIngredientList = [...mapping.entries()]
        .sort((a, b) => b[1] > a[1] ? -1 : 1).map(el => el[0]).join(',');

    console.log('Part 1:', countNonAllergenIngredients());
    console.log('Part 2:', canonicalDangerousIngredientList);
});
