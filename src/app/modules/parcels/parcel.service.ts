import httpStatus from 'http-status-codes';
import AppError from '../../utils/AppError';
import { IParcel, ParcelStatus } from './parcel.interface';
import { Parcel } from './parcel.model';
import { Types } from 'mongoose';

const createParcel = async (senderId: string | Types.ObjectId, payload: Partial<IParcel>): Promise<IParcel> => {
    const parcel = new Parcel({
        ...payload,
        sender: senderId,
        currentStatus: ParcelStatus.PENDING,
        statusHistory: [{ currentStatus: ParcelStatus.PENDING, timestamp: new Date() }],
    });
    await parcel.save();
    return parcel;
};

const getParcelsBySender = async (senderId: string | Types.ObjectId): Promise<IParcel[]> => {
    return Parcel.find({ sender: senderId });
};

const getParcelById = async (parcelId: string): Promise<IParcel | null> => {
    return Parcel.findById(parcelId);
};

const cancelParcel = async (parcelId: string, senderId: string | Types.ObjectId): Promise<IParcel> => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.sender.toString() !== senderId.toString()) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this parcel');
    }
    if (parcel.currentStatus !== ParcelStatus.PENDING) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Parcel cannot be cancelled as it is already in transit');
    }
    parcel.currentStatus = ParcelStatus.CANCELLED;
    parcel.statusHistory.push({ currentStatus: ParcelStatus.CANCELLED, timestamp: new Date() });
    await parcel.save();
    return parcel;
};

export const parcelService = {
    createParcel,
    getParcelsBySender,
    getParcelById,
    cancelParcel,
};