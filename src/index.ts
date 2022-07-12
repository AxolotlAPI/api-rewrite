import Express from "express";
import RateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const sqlite3 = require("better-sqlite3");
const db = new sqlite3("test.db");

const App = Express();

const FetchRatelimit = RateLimit({
    windowMs: 1000 * 60 * 60,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false
});

const PostRateLimit = RateLimit({
    windowMs: 1000 * 60 * 60 * 24, // Per day
    max: 1, // Max 1 request per day
    standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
    legacyHeaders: false // Disable the "X-RateLimit-*" headers
});

const VoteRateLimit = RateLimit({
    windowMs: 1000 * 60 * 60, // Per hour
    max: 1, // Max 1 request per hour
    standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
    legacyHeaders: false // Disable the "X-RateLimit-*" headers
});

import RoutePictures from "./routes/pictures";
import RouteFacts from "./routes/facts";

App.use("/pictures", RoutePictures(db, FetchRatelimit, PostRateLimit, VoteRateLimit));
App.use("/facts", RouteFacts(db, FetchRatelimit, PostRateLimit, VoteRateLimit));

const PORT = process.env.PORT || 8080;
App.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});