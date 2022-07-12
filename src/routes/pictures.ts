import Express from "express";
import RateLimit from "express-rate-limit";
import SqlString from "sqlstring-sqlite";

export default function(db): Express.Router {
    const Router = Express.Router();

    const MainRateLimit = RateLimit({
        windowMs: 1000 * 60 * 60,
        max: 120,
        standardHeaders: true,
        legacyHeaders: false
    });

    Router.get("/", MainRateLimit, (req, res) => {
        res.sendStatus(501);
    });

    Router.post("/", RateLimit({
        windowMs: 1000 * 60 * 60 * 24, // Per day
        max: 1, // Max 1 request per day
        standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
        legacyHeaders: false // Disable the "X-RateLimit-*" headers
    }), (req, res) => {
        res.sendStatus(501);
    });

    const VoteRouter = Express.Router();
    VoteRouter.use(RateLimit({
        windowMs: 1000 * 60 * 60, // Per hour
        max: 1, // Max 1 request per hour
        standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
        legacyHeaders: false // Disable the "X-RateLimit-*" headers
    }));

    VoteRouter.patch("/up", (req, res) => {
        res.sendStatus(501);
    });

    VoteRouter.patch("/down", (req, res) => {
        res.sendStatus(501);
    });

    Router.use("/vote", VoteRouter);

    return Router;
}