import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/* interface TErrorSources {
    path: string;
    message: string
}

interface TGenericErrorResponse {
    statusCode: number,
    message: string,
    errorSources?: TErrorSources[]
} */

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [{
        path: err.path,
        message: `Invalid value '${err.value}' for ${err.path}.`
    }]

    return {
        statusCode: 400,
        message: "Invalid ID provided.",
        errorSources
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];


    const errorSources: TErrorSources[] = [{
        path: field,
        message: `A user with the ${field} '${value}' already exists.`
    }];

    return {
        statusCode: 409, // 409 Conflict is more appropriate
        message: "Duplicate field value.",
        errorSources
    }
}

// mongoose validation error
const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = Object.values(err.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: val?.path,
                message: val?.message,
            };
        },
    );

    return {
        statusCode: 400,
        message: "Mongoose validation error.",
        errorSources
    }
}

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = err.issues.map((issue) => {
        return {
            path: issue.path.join('.'), // Provides a more detailed path
            message: issue.message,
        };
    });

    return {
        statusCode: 400,
        message: "Input validation error.",
        errorSources
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJwtError = (err: JsonWebTokenError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [{
        path: '',
        message: "Invalid Token. Please log in again."
    }];
    return {
        statusCode: 401,
        message: "Unauthorized Access",
        errorSources
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleTokenExpiredError = (err: TokenExpiredError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = [{
        path: '',
        message: "Your token has expired. Please log in again."
    }];
    return {
        statusCode: 401,
        message: "Token Expired",
        errorSources
    }
}

export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction) => {

    if (envVars.NODE_ENV === "development") {
        console.error(err);
    }

    let statusCode = 500;
    let message = "Something Went Wrong!";
    let errorSources: TErrorSources[] = [{
        path: '',
        message: 'Something went wrong!'
    }];

    // zod error
    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources ?? [];
    }
    // mongoose validation error
    else if (err instanceof mongoose.Error.ValidationError) {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources ?? [];
    }
    // cast error/ object id error
    else if (err instanceof mongoose.Error.CastError) {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    }
    // duplicate error
    else if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: unknown }).code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    }
    // Token Expired Error
    else if (err instanceof TokenExpiredError) {
        const simplifiedError = handleTokenExpiredError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    }
    // Other JWT Errors
    else if (err instanceof JsonWebTokenError) {
        const simplifiedError = handleJwtError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources ?? [];
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
        errorSources = [{ path: '', message: err.message }];
    } else if (err instanceof Error) {
        message = err.message
        errorSources = [{ path: '', message: err.message }];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack:
            envVars.NODE_ENV === "development"
                ? (err instanceof Error ? err.stack : undefined)
                : null
    })


}
