import AppError from "../../utils/AppError";
import { IUser, Role } from "./user.interface";
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

export const userService = {
    createUser,
    assignRole,
}
