import Express from "express";
import dotenv from "dotenv";
dotenv.config();

const sqlite3 = require("better-sqlite3");
const db = new sqlite3("test.db");

const App = Express();

// import RoutePictures from "./routes/pictures";
import RouteFacts from "./routes/facts";

// App.use("/pictures", RoutePictures(db));
App.use("/facts", RouteFacts(db));

const PORT = process.env.PORT || 8080;
App.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});