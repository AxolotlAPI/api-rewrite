const fs = require("fs");
if (fs.existsSync("test.db")) fs.rmSync("test.db");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.db");

const facts = require("../json/facts.json");
const pictures = require("../json/pictures.json");

db.serialize(() => {
    db.run("CREATE TABLE facts (author TEXT, content TEXT, score INT)");

    const factsBuilder = db.prepare("INSERT INTO facts VALUES (?, ?, ?)");
    for (const fact of facts) {
        factsBuilder.run(`author ${fact.author}`, `content ${fact.content}`, `score ${fact.score}`);
    }
    factsBuilder.finalize();

    db.run("CREATE TABLE pictures (author TEXT, url TEXT, score INT)");

    const picturesBuilder = db.prepare("INSERT INTO pictures VALUES (?, ?, ?)");
    for (const picture of pictures) {
        picturesBuilder.run(`author ${picture.author}`, `url ${picture.url}`, `score ${picture.score}`);
    }
    picturesBuilder.finalize();
});

db.close();
