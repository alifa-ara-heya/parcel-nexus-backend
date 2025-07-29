import { Application, Request, Response } from "express";
import express from 'express';

const app: Application = express();

app.use(express.json()) //a built-in middleware that parses incoming requests with JSON payloads.

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome from Parcel Delivery API.')
})

export default app;