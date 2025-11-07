import "@common/global/duration.impl";
import "@common/setup.config";
import "reflect-metadata";

import config from "config";
import express, { Request, Response } from "express";
import * as fs from "fs";
import * as yaml from "js-yaml";
import swaggerUi from 'swagger-ui-express';
import { NextFunction } from "express-serve-static-core";

const SERVER_PORT = config.get<number>('server.port');

const app = express();
app.use(express.json());

app.use("/docs/:version", (req: Request, res: Response, next: NextFunction) => {
    const { version } = req.params;
    const docPath = `./docs/swagger.${version}.yml`
    //
    if (!fs.existsSync(docPath)) 
        return res.status(404).send('Doc not found');
    (req as any).swaggerDoc = yaml.load(fs.readFileSync(docPath, 'utf-8')) as any;
    next();
}, swaggerUi.serveFiles(), swaggerUi.setup());

app.use("/api/v1/", require("./v1/route.index").default);
app.use("/api/v2/", require("./v2/route.index").default);

app.listen(SERVER_PORT, ()=>{
    console.log(`listening on port ${SERVER_PORT}`);
});
