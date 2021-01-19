'use strict';
const fs = require("fs");

const parseLine = (l) => {
    const parts = l.split('(contains');
    const ingredients = parts[0].trim().split(' ').map(s => s.trim());
    const contains = parts[1] && parts[1].slice(0, parts[1].length - 1).trim().split(',').map(s => s.trim());
    return [ingredients, contains];
}

const process = (err, data) => {
    if (err) throw err;
    const lines = data.replace(/\r/g, '').split("\n");
    const list = lines.map(parseLine);
    // console.log(list);
    const allergens = list.reduce((acc, [ing, all]) => {
        for (let i = 0; i < all.length; i++) {
            const allergen = all[i];
            if (acc.hasOwnProperty(allergen)) {
                const set = acc[allergen];
                acc[allergen] = new Set(ing.filter(x => set.has(x)));
            } else {
                acc[allergen] = new Set(ing);
            }
        }
        return acc;
    }, {});
    // console.log('allergens: ', allergens);
    const suspectIngredients = Object.values(allergens).reduce((sus, all) => {
        all.forEach(a => sus.add(a));
        return sus; 
    }, new Set());
    // console.log(suspectIngredients);
    console.log(list.reduce((acc, [ing, all]) => {
        ing.forEach(i => acc += (suspectIngredients.has(i) ? 0 : 1));
        return acc;
    }, 0));
    const badAllergens = {};
    let singles = Object.entries(allergens).reduce((acc, [k, s]) => {
        if (s.size === 1) acc[k] = [...s][0];
        return acc;   
    }, {}); 
    while (Object.values(singles).length > 0) {
        Object.entries(singles).forEach(([k, v]) => {
            badAllergens[k] = v;
            delete allergens[k];
            Object.keys(allergens).forEach(key => {
                allergens[key].delete(v);
            });
        });
        singles = Object.entries(allergens).reduce((acc, [k, s]) => {
            if (s.size === 1) acc[k] = [...s][0];
            return acc;   
        }, {});
    }
    // console.log(badAllergens);
    let cdil = '';
    Object.keys(badAllergens).sort().forEach(k => cdil += (cdil.length ? ',' : '') + badAllergens[k]);
    console.log(cdil);
};

// fs.readFile("./test.txt", 'utf8', process);
fs.readFile("./input.txt", 'utf8', process);
