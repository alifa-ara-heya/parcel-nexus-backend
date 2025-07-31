import z from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
    // body: z.object({ // Good practice to wrap in `body` for middleware
    name: z
        .string({ error: "Name is required and must be a string." })
        .min(4, "Name is too short. Minimum length should be 4 characters.",
        )
        .max(50, 'Name is too long!'
        ),

    email: z
        .email({ error: "Invalid email address format." }),

    password: z
        .string({
            error: (issue) => issue.input === undefined ?
                "Password is required" :
                "Not a string"
        })
        .min(6, "Password must be at least 6 characters long.")
        .max(20, "Password cannot exceed 20 characters.")
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    phone: z
        .string()
        .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format.")
        .optional(),

    address: z.string().optional(),

    picture: z.url({ error: "Invalid URL format for picture" }).optional(),

    role: z.enum(Role).optional(),

    // })
});