
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = (schema: ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // checking input
        try {
            await schema.parseAsync(req.body)
            next();
        } catch (error) {
            next(error)
        }
    }
}

/* 
validateRequest is a higher-order function:
It takes a Zod schema (zodSchema) as an argument.
It returns an Express middleware function (async (req, res, next) => { ... }).  */
