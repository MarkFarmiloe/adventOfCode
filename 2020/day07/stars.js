const fs = require("fs");

//shiny cyan bags contain 4 plaid green bags, 4 dim coral bags, 4 dull indigo bags.
const ruleToBagRule = (r) => {
    const re1 = /(.*) bags contain /g;
    const re2 = /(\d)* ([^\d]*) bag[s]*[,\.]/g;
    const bag = re1.exec(r)[1];
    const contents = r.slice(re1.lastIndex);
    const bagRules = {'colour': bag, 'contents': {}};
    let contentsMatch;
    while ((contentsMatch = re2.exec(contents)) !== null) {
        const qty = Number.parseInt(contentsMatch[1]);
        const innerBag = contentsMatch[2];
        bagRules['contents'][innerBag] = qty;
    };
    // console.log(bagRules);
    return bagRules;
}

const shinyGoldColours = (good, a, br) => {
    if (!br['processed'] && Object.keys(br['contents']).some(k => good.includes(k))) {
            br['processed'] = true;
            a.push(br['colour']);
    }
    return a;
}

const shinyGoldBagColours = (bagRules) => {
    const shinyGoldBagColours = [];
    let hasSG = bagRules.reduce((a, br) => shinyGoldColours(['shiny gold'], a, br), []);
    while (hasSG.length > 0) {
        shinyGoldBagColours.push(...hasSG);
        hasSG = bagRules.reduce((a, br) => shinyGoldColours(shinyGoldBagColours, a, br), []);
    }
    return shinyGoldBagColours;
}

const contentsCount = (bagRules, colour, qty, level = 0, acc = 0) => {
    const br = bagRules.filter(br => br['colour'] === colour)[0];
    if (!br) return acc;
    acc += qty;
    for (const [key, value] of Object.entries(br['contents'])) {
        acc += qty * contentsCount(bagRules, key, value, level + 1);
    }
    return acc;
}

const process = (err, data) => {
    if (err) throw err;
    const rules = data.split("\n");
    const bagRules = rules.map(ruleToBagRule);
    console.log(shinyGoldBagColours(bagRules).length);

    console.log(contentsCount(bagRules, 'shiny gold', 1) - 1);
};

fs.readFile("./input.txt", 'utf8', process);
