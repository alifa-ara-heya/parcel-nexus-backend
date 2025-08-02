import httpStatus from 'http-status-codes';
import AppError from "../../utils/AppError";
// import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import bcryptjs from 'bcryptjs'
import { createNewAccessTokensWithRefreshToken } from '../../utils/userTokens';
import { CustomJwtPayload } from '../../interfaces';
// import { JwtPayload } from 'jsonwebtoken';
// import { envVars } from '../../config/env';

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokensWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: CustomJwtPayload) => {
    // 1. Find the user and explicitly select the password field
    const user = await User.findById(decodedToken.userId).select('+password');

    if (!user) {
        // This case should be rare since the token is verified, but it's good practice
        throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    // 2. Check if the user has a password (they might have signed up with Google)
    if (!user.password) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You do not have a password set. Please use social login or set a password in your account settings.');
    }

    // 3. Compare the old password
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Old password does not match.');
    }

    // 4. Set the new plain-text password. The pre-save hook in the User model will hash it.
    user.password = newPassword;
    await user.save();
}

export const AuthServices = {
    getNewAccessToken,
    resetPassword
}