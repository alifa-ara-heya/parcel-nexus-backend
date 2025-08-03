import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { CustomJwtPayload } from "../interfaces";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token;
}

export const verifyToken = (token: string, secret: string) => {
    const verifiedToken = jwt.verify(token, secret) as CustomJwtPayload;

    return verifiedToken;
}