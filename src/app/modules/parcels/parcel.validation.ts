import { z } from 'zod';
import { ParcelStatus } from './parcel.interface';

const recipientZodSchema = z.object({
    name: z.string(),
    email: z.email().optional(),
    phone: z.string(),
    address: z.string(),
});

export const createParcelZodSchema = z.object({
    body: z.object({
        recipient: recipientZodSchema,
        deliveryFee: z.number().optional(),
        pickupAddress: z.string().optional(),
        weight: z.number(),
        notes: z.string().optional(),
    })
});

export const updateParcelStatusZodSchema = z.object({
    body: z.object({
        status: z.enum(ParcelStatus),
    }),
});
