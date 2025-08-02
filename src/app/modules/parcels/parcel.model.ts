import { model, Schema } from "mongoose";
import { IParcel, IRecipient, IStatusLog, ParcelStatus } from "./parcel.interface";

const recipientSchema = new Schema<IRecipient>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, { _id: false });

const statusLogSchema = new Schema<IStatusLog>({
    currentStatus: {
        type: String,
        enum: Object.values(ParcelStatus), required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    note: {
        type: String
    },
}, { _id: false });


const parcelSchema = new Schema<IParcel>({
    trackingNumber: {
        type: String,
        unique: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: recipientSchema, required: true
    },
    deliveryMan: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryFee: {
        type: Number
    },
    pickupAddress: {
        type: String
    },
    currentStatus: {
        type: String,
        enum: Object.values(ParcelStatus),
        default: ParcelStatus.PENDING
    },
    statusHistory: [statusLogSchema],
    weight: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    },
}, { timestamps: true, versionKey: false });

// Pre-save middleware to generate a unique tracking number
parcelSchema.pre('save', async function (next) {
    if (this.isNew) {
        const date = new Date();

        const year = date.getFullYear();

        const month =
            (date.getMonth() + 1)
                .toString()
                .padStart(2, '0');

        const day =
            date.getDate().toString().padStart(2, '0');

        const randomPart =
            Math.
                random().
                toString(36).
                substring(2, 8).toUpperCase();

        this.trackingNumber = `TRK-${year}${month}${day}-${randomPart}`;
    }
    next();
});

export const Parcel = model<IParcel>('Parcel', parcelSchema);
