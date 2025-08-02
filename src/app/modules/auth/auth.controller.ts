import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import AppError from '../../utils/AppError';
import passport from 'passport';
import { createUserTokens } from '../../utils/userTokens';
import { setAuthCookie } from '../../utils/setCookie';
import { envVars } from '../../config/env';

/* const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { accessToken, user } = await authService.loginUser(req.body);

    // To prevent password from being sent in the response
    const userResponse = JSON.parse(JSON.stringify(user));
    delete userResponse.password;

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in successfully',
        data: { user: userResponse, token: accessToken },
    });
}); */



const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {
        if (err) {
            return next(new AppError(401, err))
        }

        if (!user) {
            // return new AppError(401, info.message) - not right
            return next(new AppError(401, info.message))

        }

        const userTokens = createUserTokens(user);

        // Convert to a plain object to remove the password before sending the response
        const userResponse = user.toObject();
        delete userResponse.password;

        setAuthCookie(res, userTokens);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: userResponse,
            }
        })
    })(req, res, next)

})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies.")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, tokenInfo)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: "lax"
    })


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged Out Successfully",
        data: null
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    // We can safely assert the type here because the `checkAuth` middleware,
    // which runs before this controller, guarantees that `req.user` will be
    // a CustomJwtPayload and not undefined.
    const decodedToken = req.user as CustomJwtPayload;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed Successfully",
        data: null
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : '';

    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user

    console.log("user", user);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
};
