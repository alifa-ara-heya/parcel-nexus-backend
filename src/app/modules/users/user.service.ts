import AppError from "../../utils/AppError";
import { IUser } from "./user.interface";
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

export const userService = {
    createUser,
}
