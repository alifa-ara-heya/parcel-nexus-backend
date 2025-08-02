import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { IUser, Role } from "../modules/users/user.interface";

declare global {
    // Create a custom JWT payload type for better type-safety
    interface CustomJwtPayload extends JwtPayload {
        userId: Types.ObjectId | string;
        email: string;
        role: Role;
    }
    namespace Express {
        interface Request {
            // This allows req.user to hold either a full user document or a JWT payload.
            user?: IUser | CustomJwtPayload;
        }
    }
}