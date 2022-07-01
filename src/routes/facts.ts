import Express from "express";

import FactsJSON from "../json/facts.json";

const FactsArray = Object.entries(FactsJSON);

const Router = Express.Router();

function GetRandomFact({ Author, Search, MinScore, MaxScore }): Object | null {
    let NewFactsArray = FactsArray;
    
    if (Author) NewFactsArray = NewFactsArray.filter(fact => fact[1].author === Author);
    if (Search) NewFactsArray = NewFactsArray.filter(fact => fact[1].content.includes(Search));
    if (MinScore) NewFactsArray = NewFactsArray.filter(fact => fact[1].score >= MinScore);
    if (MaxScore) NewFactsArray = NewFactsArray.filter(fact => fact[1].score <= MaxScore);

    if (NewFactsArray.length === 0) return null; // No fact was found

    let FactObj: any = NewFactsArray[Math.floor(Math.random() * NewFactsArray.length)];
    let FactJson = FactObj[1];
    FactJson.id = Number(FactObj[0]);
    
    return FactJson;
}

Router.get("/", (req, res) => {
    const Amount    = req.query.amount || 1; // Bulk searches

    const Author    = req.query.author; // Specific author
    const Search    = req.query.search; // Search for content
    const MinScore  = req.query.minScore; // Minimum score
    const MaxScore  = req.query.maxScore; // Maximum score

    if (Amount > 100) return res.status(403).send({
        message: "You're not allowed to request more than 100 facts at a time!"
    });

    let Facts: Array<Object> = [];

    for (let i = 0; i < Amount; i++) {
        let Fact: Object | null = GetRandomFact({ Author, Search, MinScore, MaxScore });
        if (Fact !== null) Facts.push(Fact);
        else {
            return res.status(508).send({
                message: `No facts could be found for query ${JSON.stringify(req.query)}.`
            });
        }
    }

    res.status(200).send(Facts);
});

export default Router;