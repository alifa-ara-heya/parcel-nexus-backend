import AppError from "../../utils/AppError";
import { IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';

const createUser = async (payload: IUser) => {
    const { email } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.CONFLICT, 'User with this email already exists');
    }

    const result = await User.create(payload);
    return result;
}

const getAllUsers = async (): Promise<IUser[]> => {
    // Find all users but exclude admins from the list for security.
    // Also, exclude the password field from the result.
    return User.find({ role: { $ne: Role.ADMIN } }).select('-password');
};

const assignRole = async (userId: string, newRole: Role): Promise<IUser> => {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    // Prevent an admin from being demoted by this endpoint
    if (user.role === Role.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot change the role of an admin.');
    }

    // Update the user's role
    user.role = newRole;

    // Save the updated user document
    await user.save();

    return user;
};

const updateUserStatus = async (userId: string, newStatus: IsActive, adminId: string): Promise<IUser> => {
    // Find the user to be updated
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    // Safety check: Prevent an admin from blocking themselves.
    if (user._id.toString() === adminId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You cannot change your own status.');
    }

    // Safety check: Prevent an admin from blocking another admin.
    if (user.role === Role.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot change the status of an admin.');
    }

    // Update the user's active status
    user.isActive = newStatus;

    // Save the updated user document
    await user.save();

    return user;
};

export const userService = {
    createUser,
    getAllUsers,
    assignRole,
    updateUserStatus,
}
