import { Types } from 'mongoose';

export enum ParcelStatus {
    PENDING = 'PENDING', // User created, waiting for pickup
    PICKED_UP = 'PICKED_UP', // Delivery man picked it up
    IN_TRANSIT = 'IN_TRANSIT', // On its way
    DELIVERED = 'DELIVERED', // Delivered to recipient
    CANCELLED = 'CANCELLED', // Cancelled by user
    RETURNED = 'RETURNED', // Could not be delivered and returned to sender
}

export interface IRecipient {
    name: string;
    email?: string; // Optional, recipient might not be a user
    phone: string;
    address: string;
}

// interface for a single history entry
export interface IStatusLog {
    currentStatus: ParcelStatus;
    timestamp: Date;
    updatedBy?: Types.ObjectId // Optional: To track if an admin or delivery man updated it
}

export interface IParcel {
    _id: Types.ObjectId;
    trackingNumber: string; // A unique tracking number, can be generated

    /** Reference to the User who sent the parcel. */
    sender: Types.ObjectId;

    recipient: IRecipient;

    /** Reference to the User (role: DELIVERY_MAN) assigned to this parcel. */
    deliveryMan?: Types.ObjectId;

    deliveryFee?: number;

    pickupAddress?: string;

    currentStatus: ParcelStatus;

    statusHistory: IStatusLog[]; // An array of all status changes

    weight: number; // in kg

    notes?: string; // Any special instructions

    createdAt: Date;

    updatedAt: Date;
}
