import httpStatus from 'http-status-codes';
import AppError from '../../utils/AppError';
import { IParcel, ParcelStatus } from './parcel.interface';
import { Parcel } from './parcel.model';
import { Types } from 'mongoose';

/**
 * Creates a new parcel booking.
 * @param senderId - The ID of the user creating the parcel.
 * @param payload - The parcel data from the request body.
 * @returns The newly created parcel document.
 */
const createParcel = async (
    senderId: string | Types.ObjectId,
    payload: Partial<IParcel>,
): Promise<IParcel> => {
    const { recipient } = payload;

    // If a userId for the recipient is provided, validate that it's a correct ObjectId format.
    if (recipient?.userId && !Types.ObjectId.isValid(recipient.userId)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid receiver user ID format.');
    }

    // Construct the data for the new parcel, combining the payload with server-generated data.
    const newParcelData = {
        ...payload,
        sender: new Types.ObjectId(senderId), // Set the sender from the authenticated user.
        currentStatus: ParcelStatus.PENDING, // Set the initial status.
        // Create the first entry in the status history log.
        statusHistory: [
            {
                currentStatus: ParcelStatus.PENDING,
                timestamp: new Date(),
                updatedBy: new Types.ObjectId(senderId),
                note: 'Parcel booking created by sender.',
            },
        ],
    };

    // The trackingNumber is generated automatically by the pre-save hook in parcel.model.ts.
    // Parcel.create is a convenient method that creates a new document and saves it.
    const newParcel = await Parcel.create(newParcelData);

    // Return the complete parcel object.
    return newParcel;
};

/**
 * Retrieves all parcels booked by a specific sender.
 * @param senderId - The ID of the user whose parcels to retrieve.
 * @returns A promise that resolves to an array of parcel documents.
 */
const getParcelsBySender = async (senderId: string | Types.ObjectId): Promise<IParcel[]> => {
    // Find all parcels where the 'sender' field matches the provided senderId.
    return Parcel.find({ sender: senderId });
};

/**
 * Retrieves a single parcel by its unique ID.
 * @param parcelId - The ID of the parcel to retrieve.
 * @returns A promise that resolves to the parcel document or null if not found.
 */
const getParcelById = async (parcelId: string): Promise<IParcel | null> => {
    // Find a single parcel by its MongoDB document ID.
    return Parcel.findById(parcelId);
};

/**
 * Cancels a parcel booking.
 * @param parcelId - The ID of the parcel to cancel.
 * @param senderId - The ID of the user attempting to cancel the parcel.
 * @returns A promise that resolves to the updated (cancelled) parcel document.
 */
const cancelParcel = async (parcelId: string, senderId: string | Types.ObjectId): Promise<IParcel> => {
    // First, find the parcel by its ID.
    const parcel = await Parcel.findById(parcelId);

    // If the parcel doesn't exist, throw a 404 Not Found error.
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }

    // Security check: Ensure the user trying to cancel is the one who created it.
    if (parcel.sender.toString() !== senderId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this parcel');
    }

    // Business logic: A parcel can only be cancelled if its status is 'PENDING'.
    if (parcel.currentStatus !== ParcelStatus.PENDING) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Parcel cannot be cancelled as it is already in transit');
    }

    // Update the parcel's status to CANCELLED.
    parcel.currentStatus = ParcelStatus.CANCELLED;

    // Add a log entry to the status history to record the cancellation.
    parcel.statusHistory.push({
        currentStatus: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(senderId),
        note: 'Parcel cancelled by sender.',
    });

    // Save the updated parcel document to the database.
    await parcel.save();

    // Return the updated parcel.
    return parcel;
};

// Export all service functions as a single object for the controller to use.
export const parcelService = {
    createParcel,
    getParcelsBySender,
    getParcelById,
    cancelParcel,
};