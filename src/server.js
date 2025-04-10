import express from "express";
import cors from "cors";
import pino from "pino-http";

import { getEnvVar } from "./utils/getEnvVar.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import router from "./routers/contacts.js";

const PORT = Number(getEnvVar("PORT", "3000"));

export const setupServer = async () => {
    const app = express();
    app.use(cors());

    app.use(
        pino({
            transport: {
                target: "pino-pretty",
            },
        })
    );
    app.use('/contacts', router);

    app.use(notFoundHandler);
    app.use(errorHandler);


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};