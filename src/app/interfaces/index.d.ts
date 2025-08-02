import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { Role } from "../modules/users/user.interface";

// This defines the shape of the JWT payload that passport will decode and attach to req.user
export interface CustomJwtPayload extends JwtPayload {
    userId: Types.ObjectId | string;
    email: string;
    role: Role;
}

declare global {
    namespace Express {
        // Augment the Express.User interface to match our CustomJwtPayload
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends CustomJwtPayload { }
    }
}