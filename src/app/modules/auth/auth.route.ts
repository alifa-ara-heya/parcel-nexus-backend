import { Router } from 'express';
import passport from 'passport';
import { AuthControllers } from "./auth.controller";
import { envVars } from '../../config/env';
import { checkAuth } from '../../middlewares/checkAuth';
import { NextFunction, Request, Response } from 'express';
import { Role } from '../users/user.interface';

const router = Router();

router.post("/login", AuthControllers.credentialsLogin)

router.post("/refresh-token", AuthControllers.getNewAccessToken)

router.post('/logout', AuthControllers.logout)

router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '/'
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect as string
    })(req, res, next)
})

router.get("/google/callback",
    passport.authenticate("google",
        { failureRedirect: `${envVars.FRONTEND_URL}/login?error=google-auth-failed`, session: false }),
    AuthControllers.googleCallbackController)

export const AuthRoutes = router;
