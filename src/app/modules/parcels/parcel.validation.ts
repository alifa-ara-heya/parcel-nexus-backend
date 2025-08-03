import { z } from 'zod';
import { ParcelStatus } from './parcel.interface';

const recipientZodSchema = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    userId: z.string().optional(), // We'll validate it's a valid ObjectId in the service
    phone: z.string().optional(),
    address: z.string().optional(),
});

export const createParcelZodSchema = z.object({
    recipient: recipientZodSchema,
    deliveryFee: z.number().optional(),
    pickupAddress: z.string().optional(),
    weight: z.number({ error: "Weight is required." }),
    notes: z.string().optional(),
});

export const updateParcelStatusZodSchema = z.object({
    status: z.enum(Object.values(ParcelStatus)),
});

export const assignDeliveryManZodSchema = z.object({
    deliveryManId: z.string({ error: "deliveryManId is required." }),
});
