import { Response } from 'express';
import httpStatus from 'http-status-codes';
import { AuthenticatedRequest } from '../../interfaces/request.types';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { parcelService } from './parcel.service';

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

const getParcelById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;

    const { userId, role } = req.user; // Extract user info from the authenticated request

    const result = await parcelService.getParcelById(parcelId, { userId, role });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel retrieved successfully',
        data: result,
    });
});

const cancelParcel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;
    const { userId, role } = req.user;

    const result = await parcelService.cancelParcel(parcelId, { userId, role });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel cancelled successfully',
        data: result,
    });
});

const getAllParcels = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
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

const getIncomingParcels = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const receiverId = req.user.userId;
    const { parcels, total } = await parcelService.getParcelsByReceiver(receiverId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Incoming parcels retrieved successfully',
        meta: { total },
        data: parcels,
    });
});

const assignDeliveryMan = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;
    const { deliveryManId } = req.body;
    const adminId = req.user.userId;

    const result = await parcelService.assignDeliveryMan(parcelId, deliveryManId, adminId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Delivery man assigned successfully',
        data: result,
    });
});

const getMyDeliveries = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const deliveryManId = req.user.userId;
    const { parcels, total } = await parcelService.getParcelsByDeliveryMan(deliveryManId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Assigned parcels retrieved successfully',
        meta: { total },
        data: parcels,
    });
});

const updateDeliveryStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;
    const { status } = req.body;
    const { userId, role } = req.user;

    const result = await parcelService.updateDeliveryStatus(parcelId, status, { userId, role });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel status updated successfully',
        data: result,
    });
});

const confirmDelivery = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;
    const { userId, role } = req.user;

    const result = await parcelService.confirmDelivery(parcelId, { userId, role });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel delivery confirmed successfully',
        data: result,
    });
});

const blockParcel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;
    const adminId = req.user.userId;

    const result = await parcelService.blockParcel(parcelId, adminId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel has been put on hold',
        data: result,
    });
});

const unblockParcel = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id: parcelId } = req.params;
    const adminId = req.user.userId;

    const result = await parcelService.unblockParcel(parcelId, adminId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel has been unblocked',
        data: result,
    });
});

export const parcelController = {
    createParcel,
    getMyParcels,
    getParcelById,
    cancelParcel,
    getAllParcels,
    getIncomingParcels,
    assignDeliveryMan,
    getMyDeliveries,
    updateDeliveryStatus,
    confirmDelivery,
    blockParcel,
    unblockParcel,
};