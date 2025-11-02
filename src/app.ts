import "@common/global/duration.impl";
import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config({quiet: true});

import config from "config";
import express from "express";

const SERVER_PORT = config.get<number>('server.port');

const app = express();
app.use(express.json());
app.use("/api/v1/", require("./v1/route.index").default);
app.use("/api/v2/", require("./v2/route.index").default);

app.listen(SERVER_PORT, ()=>{
    console.log(`listening on port ${SERVER_PORT}`);
});
