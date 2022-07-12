import Express from "express";
import SqlString from "sqlstring-sqlite";

export default function(db, FetchRatelimit, PostRateLimit, VoteRateLimit): Express.Router {
    const Router = Express.Router();

    Router.get("/", FetchRatelimit, (req, res) => {
        res.sendStatus(501);
    });

    Router.post("/", PostRateLimit, (req, res) => {
        res.sendStatus(501);
    });

    const VoteRouter = Express.Router();
    VoteRouter.use(VoteRateLimit);

    VoteRouter.patch("/up", (req, res) => {
        res.sendStatus(501);
    });

    VoteRouter.patch("/down", (req, res) => {
        res.sendStatus(501);
    });

    Router.use("/vote", VoteRouter);

    return Router;
}