import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from '../utils/AppError'
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/users/user.model";
import { IsActive } from '../modules/users/user.interface';

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET)

        const isUserExist = await User.findOne({ email: verifiedToken.email })
        console.log('User', isUserExist);

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!")
        }

        req.user = verifiedToken //we declared a global type for it in app> interface> index.d.ts
        /* declare global {
            namespace Express {
                interface Request {
                    user: JwtPayload
                }
            }
        } */

        next()


    } catch (error) {
        console.log('JWT error', error);
        next(error)
    }
}