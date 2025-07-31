import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";

const router = Router();

router.post('/register',
    validateRequest(createUserZodSchema),
    userController.createUser,
)

export const UserRoutes = router;
