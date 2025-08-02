import { Application, Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notfound";
import passport from 'passport';
import './app/config/passport';
import cookieParser from "cookie-parser";
import { router } from "./app/routes";

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

// Initialize passport
app.use(passport.initialize());

// Application Routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome from Parcel Delivery API.')
})

app.use(globalErrorHandler)
// not found route (must be used after global error handler)
app.use(notFound)


export default app;