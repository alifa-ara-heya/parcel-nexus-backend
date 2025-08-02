import { Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { parcelService } from './parcel.service';
import { AuthenticatedRequest } from '../../interfaces/request.types';

const createParcel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const senderId = req.user.userId;
    const result = await parcelService.createParcel(senderId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Parcel created successfully',
        data: result,
    });
});

const getMyParcels = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const senderId = req.user.userId;
    const result = await parcelService.getParcelsBySender(senderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcels retrieved successfully',
        data: result,
    });
});

const getParcelById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await parcelService.getParcelById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel retrieved successfully',
        data: result,
    });
});

const cancelParcel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const senderId = req.user.userId;
    const result = await parcelService.cancelParcel(req.params.id, senderId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel cancelled successfully',
        data: result,
    });
});

export const parcelController = {
    createParcel,
    getMyParcels,
    getParcelById,
    cancelParcel,
};