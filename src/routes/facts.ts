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
        const Amount    = req.query.amount || 1; // Bulk searches
        
        if (Amount > 100) return res.status(403).send({
            message: "You're not allowed to request more than 100 facts at a time!"
        });

        const Author    = req.query.author; // Specific author
        const Search    = req.query.search; // Search for content
        const MinScore  = req.query.minScore; // Minimum score
        const MaxScore  = req.query.maxScore; // Maximum score
    
        let FilterStrings = ["1"];

        if (Author) FilterStrings.push(`author = '${Author}'`);
        if (Search) FilterStrings.push(`instr(LOWER(content), '${(Search as String).toLowerCase()}')`);
        if (MinScore) FilterStrings.push(`score >= ${MinScore}`);
        if (MaxScore) FilterStrings.push(`score <= ${MaxScore}`);
        
        let Rows = db.prepare(`SELECT * FROM facts WHERE ${FilterStrings.join(" AND ")}`).all();
        if (Rows.length == 0) {
            return res.status(508).send({
                message: `No facts could be found for query ${JSON.stringify(req.query)}.`
            });
        }

        let Facts: Array<any> = [];
        for (let i = 0; i < Amount; i++) {
            Facts.push(Rows[Math.floor(Math.random() * Rows.length)]);
        }

        res.send(Facts);
    });

    Router.post("/", RateLimit({
        windowMs: 1000 * 60 * 60 * 24, // Per day
        max: 1, // Max 1 request per day
        standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
        legacyHeaders: false // Disable the "X-RateLimit-*" headers
    }), (req, res) => {
        const Content = req.query.content;
        const Author = req.query.author;
        if (!Content || !Author) return res.status(400).send({
            message: "Missing fields."
        });

        console.log(`Creating new fact: ${Content} by ${Author}`);

        if (db.prepare("SELECT * FROM facts WHERE content = " + SqlString.escape(Content)).get() !== undefined) {
            return res.status(400).send({
                message: "This fact has already been submitted."
            });
        }

        res.send({
            id: db.prepare(`INSERT INTO facts VALUES (NULL, ${SqlString.escape(Author)}, ${SqlString.escape(Content)}, 0)`).run().lastInsertRowid
        });
    });

    const VoteRouter = Express.Router();
    VoteRouter.use(RateLimit({
        windowMs: 1000 * 60 * 60, // Per hour
        max: 1, // Max 1 request per hour
        standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
        legacyHeaders: false // Disable the "X-RateLimit-*" headers
    }));

    VoteRouter.patch("/up", (req, res) => {
        const ID = Number(req.query.id);
        if (isNaN(ID)) return res.status(400).send({
            message: "Invalid ID."
        });

        try {
            let Score = db.prepare("SELECT * FROM facts WHERE id = ?").get(ID).score;
            db.prepare("UPDATE facts SET score = ? WHERE id = ?").run(Score + 1, ID);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
            throw e;
        }
    });

    VoteRouter.patch("/down", (req, res) => {
        const ID = Number(req.query.id);
        if (isNaN(ID)) return res.status(400).send({
            message: "Invalid ID."
        });

        try {
            let Score = db.prepare("SELECT * FROM facts WHERE id = ?").get(ID).score;
            db.prepare("UPDATE facts SET score = ? WHERE id = ?").run(Score - 1, ID);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(500);
            throw e;
        }
    });

    Router.use("/vote", VoteRouter);

    return Router;
}