/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { parcelService } from './parcel.service';

const createParcel = catchAsync(async (req: Request, res: Response) => {
    // We use the non-null assertion (!) because the checkAuth middleware guarantees
    // that req.user will be populated on protected routes.

    const senderId = req.user!.userId;
    const result = await parcelService.createParcel(senderId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Parcel created successfully',
        data: result,
    });
});

const getMyParcels = catchAsync(async (req: Request, res: Response) => {

    const senderId = req.user!.userId;
    // The service now returns an object with the parcels array and the total count.
    const { parcels, total } = await parcelService.getParcelsBySender(senderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcels retrieved successfully',
        // Add a meta object for pagination or total counts.
        meta: { total },
        data: parcels,
    });
});

const getParcelById = catchAsync(async (req: Request, res: Response) => {
    const { id: parcelId } = req.params;

    const { userId, role } = req.user!; // Extract user info from the authenticated request

    const result = await parcelService.getParcelById(parcelId, { userId, role });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel retrieved successfully',
        data: result,
    });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const { id: parcelId } = req.params;
    const { userId, role } = req.user!;

    const result = await parcelService.cancelParcel(parcelId, { userId, role });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel cancelled successfully',
        data: result,
    });
});

const getAllParcels = catchAsync(async (req: Request, res: Response) => {
    // In the future, we can pass query params for filtering/pagination here
    const { parcels, total } = await parcelService.getAllParcels();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All parcels retrieved successfully',
        meta: { total },
        data: parcels,
    });
});

const getIncomingParcels = catchAsync(async (req: Request, res: Response) => {
    const receiverId = req.user!.userId;
    const { parcels, total } = await parcelService.getParcelsByReceiver(receiverId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Incoming parcels retrieved successfully',
        meta: { total },
        data: parcels,
    });
});

export const parcelController = {
    createParcel,
    getMyParcels,
    getParcelById,
    cancelParcel,
    getAllParcels,
    getIncomingParcels,
};