import * as fs from 'node:fs';
import path from 'node:path';
import express from "express";
import cors from "cors";
import pino from "pino-http";

import { getEnvVar } from "./utils/getEnvVar.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import router from "./routers/index.js";
import cookieParser from "cookie-parser";
import swaggerUIExpress from 'swagger-ui-express';


const PORT = Number(getEnvVar("PORT", "3000"));
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);
export const setupServer = async () => {
    const app = express();

    app.use(cors());
    app.use(
        '/api-docs',
        swaggerUIExpress.serve,
        swaggerUIExpress.setup(swaggerDocument),
    );
    app.use(
        pino({
            transport: {
                target: "pino-pretty",
            },
        })
    );
    app.use('/uploads', express.static(path.resolve('src', 'uploads')));
    app.use(cookieParser());
    app.use('/', router);

    app.use(notFoundHandler);
    app.use(errorHandler);


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};