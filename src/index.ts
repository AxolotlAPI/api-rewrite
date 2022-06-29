import Express from "express";

import dotenv from "dotenv";
dotenv.config();

const App = Express();

App.get("/", (req, res) => {
    res.send("Hello world!");
});

const PORT = process.env.PORT || 8080;
App.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});