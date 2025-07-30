import { NextFunction, Request } from "express";
import { envVars } from "../config/env";
import mongoose from "mongoose";

interface TErrorSources {
    path: string;
    message: string
}

interface TGenericErrorResponse {
    statusCode: number,
    message: string,
    errorSources?: TErrorSources[]
}

const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id."
    }
}

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    }
}


const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = []

    const errors = Object.values(err.errors)

    errors.forEach((errorObject: any) => errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }))

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    }
}

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction) => {

    if (envVars.NODE_ENV === "development") {
        console.error(err);
    }

    let errorSources: TErrorSources[] = []

    let statusCode = 500
    let message = "Something Went Wrong!"

    // duplicate error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }


}

