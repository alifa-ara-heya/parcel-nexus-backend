import { Application, Request, Response } from "express";
import express from 'express';
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json()) //a built-in middleware that parses incoming requests with JSON payloads.

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome from Parcel Delivery API.')
})

app.use(globalErrorHandler)

export default app;