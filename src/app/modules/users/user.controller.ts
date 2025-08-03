import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully',
        data: result,
    });
});

const assignRole = catchAsync(async (req: Request, res: Response) => {
    const { id: userId } = req.params;
    const { role } = req.body;

    const result = await userService.assignRole(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
});

export const userController = {
    createUser,
    assignRole,
};
