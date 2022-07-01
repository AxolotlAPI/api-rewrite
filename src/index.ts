import Express from "express";
import ExpressPublicIp from "express-public-ip";

import dotenv from "dotenv";
dotenv.config();

const App = Express();

App.enable("trust proxy");

App.use(ExpressPublicIp());

App.use((req, res, next) => {
    console.log(req.ip);
    next();
})

import RoutePictures from "./routes/pictures";
App.use("/pictures", RoutePictures);

import RouteFacts from "./routes/facts";
App.use("/facts", RouteFacts);

const PORT = process.env.PORT || 8080;
App.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});