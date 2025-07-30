import { Types } from "mongoose";

/**
 * Roles for users in the system.
 * ADMIN: Has full access to the system.
 * USER: Can send and receive parcels.
 * DELIVERY_MAN: Responsible for delivering parcels.
 */


export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    DELIVERY_MAN = "DELIVERY_MAN",
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string
}


export enum IsActive {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}


export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[];
    createdAt: Date;
    updatedAt: Date;
}