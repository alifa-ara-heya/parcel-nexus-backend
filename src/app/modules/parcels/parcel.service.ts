import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import AppError from '../../utils/AppError';
import { User } from '../users/user.model';
import { IParcel, IRecipient, ParcelStatus } from './parcel.interface';
import { Parcel } from './parcel.model';

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
    // This variable will hold the final, validated recipient information.
    let finalRecipient: IRecipient;

    // --- Smart Recipient Logic ---
    // Case 1: The sender provides the recipient's userId to auto-populate details.
    if (payload.recipient?.userId) {
        // Validate the provided userId is a valid MongoDB ObjectId.
        if (!Types.ObjectId.isValid(payload.recipient.userId)) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid receiver user ID format.');
        }

        // Find the recipient user in the database.
        const recipientUser = await User.findById(payload.recipient.userId);
        if (!recipientUser) {
            throw new AppError(httpStatus.NOT_FOUND, 'Recipient user with the provided ID was not found.');
        }

        // Automatically populate recipient details from the found user document.
        // This ensures the data is accurate and up-to-date.
        finalRecipient = {
            userId: recipientUser._id,
            name: recipientUser.name,
            phone: recipientUser.phone || 'Not Provided', // Use fallback if user has no phone saved
            address: recipientUser.address || 'Not Provided', // Use fallback if user has no address saved
            email: recipientUser.email,
        };
    }
    // Case 2: The sender provides recipient details manually.
    else if (payload.recipient?.name && payload.recipient?.phone && payload.recipient?.address) {
        finalRecipient = {
            name: payload.recipient.name,
            phone: payload.recipient.phone,
            address: payload.recipient.address,
            email: payload.recipient.email, // email is optional
        };
    }
    // Case 3: Insufficient information was provided in the request.
    else {
        throw new AppError(httpStatus.BAD_REQUEST, 'You must provide either a recipient userId or the full recipient details (name, phone, and address).');
    }

    // Construct the data for the new parcel, combining the payload with server-generated data.
    const newParcelData = {
        ...payload,
        recipient: finalRecipient, // Use the validated and populated recipient object.
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

const getParcelsBySender = async (
    senderId: string | Types.ObjectId,
): Promise<{ parcels: IParcel[]; total: number }> => {
    const filter = { sender: senderId };

    // Run find and countDocuments queries in parallel for efficiency.
    const [parcels, total] = await Promise.all([
        Parcel.find(filter).sort({ createdAt: -1 }), // Sort by most recent
        Parcel.countDocuments(filter),
    ]);

    // Return both the list of parcels and the total count.
    return { parcels, total };
};

/**
 * Retrieves a single parcel by its unique ID.
 * @param parcelId - The ID of the parcel to retrieve.
 * @returns A promise that resolves to the parcel document or null if not found.
 */
const getParcelById = async (
    parcelId: string,
    user: { userId: string | Types.ObjectId; role: string },
): Promise<IParcel | null> => {
    // Find a single parcel by its MongoDB document ID.
    const parcel = await Parcel.findById(parcelId);

    // If no parcel is found, throw an error.
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }

    // An ADMIN can view any parcel, so we return it immediately.
    if (user.role === 'ADMIN') {
        return parcel;
    }

    // A regular USER can only view a parcel if they are the sender.
    if (parcel.sender.toString() !== user.userId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view this parcel');
    }

    return parcel;
};

/**
 * Cancels a parcel booking.
 * @param parcelId - The ID of the parcel to cancel.
 * @param user - The user (with ID and role) attempting to cancel the parcel.
 * @returns A promise that resolves to the updated (cancelled) parcel document.
 */
const cancelParcel = async (parcelId: string, user: { userId: string | Types.ObjectId; role: string }): Promise<IParcel> => {
    // First, find the parcel by its ID.
    const parcel = await Parcel.findById(parcelId);

    // If the parcel doesn't exist, throw a 404 Not Found error.
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }

    // Security check: An ADMIN can cancel any parcel, otherwise only the sender can.
    if (user.role !== 'ADMIN' && parcel.sender.toString() !== user.userId.toString()) {
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
        updatedBy: new Types.ObjectId(user.userId),
        note: user.role === 'ADMIN' ? 'Parcel cancelled by admin.' : 'Parcel cancelled by sender.',
    });

    // Save the updated parcel document to the database.
    await parcel.save();

    // Return the updated parcel.
    return parcel;
};

/**
 * Retrieves all parcels in the system. (Admin only)
 * @returns A promise that resolves to an object containing the array of all parcel documents and the total count.
 */
const getAllParcels = async (): Promise<{ parcels: IParcel[]; total: number }> => {
    // An empty filter object will match all documents in the collection.
    const filter = {};

    // Run find and countDocuments queries in parallel for efficiency.
    const [parcels, total] = await Promise.all([
        Parcel.find(filter).sort({ createdAt: -1 }), // Sort by most recent
        Parcel.countDocuments(filter),
    ]);

    // Return both the list of parcels and the total count.
    return { parcels, total };
};

// Export all service functions as a single object for the controller to use.
export const parcelService = {
    createParcel,
    getParcelsBySender,
    getParcelById,
    cancelParcel,
    getAllParcels
};