import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from '../utils/AppError'
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/users/user.model";
import { IsActive } from '../modules/users/user.interface';

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        }

        const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET)

        const isUserExist = await User.findOne({ email: verifiedToken.email })
        console.log('User', isUserExist);

        if (!isUserExist) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User with this token no longer exists.")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.FORBIDDEN, `Your account is ${isUserExist.isActive.toLowerCase()}. Please contact support.`)
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User with this token has been deleted.")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to view this route!")
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