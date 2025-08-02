import { NextFunction, Request, Response } from "express";

// Define a generic type for a request handler that can have a custom request object
// This makes the catchAsync utility more flexible and reusable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncRequestHandler<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => Promise<any>;

export const catchAsync = <T extends Request>(fn: AsyncRequestHandler<T>) =>
    (req: T, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(err => next(err));
    };