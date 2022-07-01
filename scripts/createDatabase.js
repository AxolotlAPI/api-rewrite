const fs = require("fs");
if (fs.existsSync("test.db")) fs.rmSync("test.db");

const sqlite3 = require("better-sqlite3");
const db = new sqlite3("test.db");

const facts = require("../json/facts.json");
const pictures = require("../json/pictures.json");

db.prepare("CREATE TABLE facts (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, content TEXT, score INT)").run();

const factsBuilder = db.prepare("INSERT INTO facts VALUES (NULL, ?, ?, ?)");
for (const fact of facts) {
    factsBuilder.run(`${fact.author}`, `${fact.content}`, `${fact.score}`);
}

db.prepare("CREATE TABLE pictures (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, url TEXT, score INT)").run();

const picturesBuilder = db.prepare("INSERT INTO pictures VALUES (NULL, ?, ?, ?)");
for (const picture of pictures) {
    picturesBuilder.run(`${picture.author}`, `${picture.url}`, `${picture.score}`);
}