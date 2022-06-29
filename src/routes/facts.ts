import Express from "express";

import FactsJSON from "../json/facts.json";

const FactsArray = Object.entries(FactsJSON);

const Router = Express.Router();

function GetRandomFact({ Author, Search }): String {
    let fact;

    while (true) {
        fact = FactsArray[Math.floor(Math.random() * FactsArray.length)];

        if (Author) if (fact.author != Author) continue;
        if (Search) if (!fact.content.includes(Search)) continue;

        break;
    }

    return fact[1];
}

Router.get("/", (req, res) => {
    const Amount = req.query.amount || 1; // Bulk searches
    const Author = req.query.author; // Specific author
    const Search = req.query.search; // Search for content

    let Facts: Array<String> = [];
    for (let i = 0; i < Amount; i++) {
        Facts.push(GetRandomFact({ Author, Search }));
    }

    res.status(200).send(Facts);
});

export default Router;