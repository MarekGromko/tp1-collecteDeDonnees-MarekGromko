import dotenv from "dotenv"
dotenv.config({quiet: true});

import express from "express";

const SERVER_PORT = process.env.SERVER_PORT;

const app = express();
app.use(express.json());
app.use("/api/v1/", require("./v1/route.index").default);

app.listen(SERVER_PORT, ()=>{
    console.log(`listening on port ${SERVER_PORT}`);
});
