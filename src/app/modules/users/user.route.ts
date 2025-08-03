import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { assignRoleZodSchema, createUserZodSchema } from "./user.validation";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post('/register',
    validateRequest(createUserZodSchema),
    userController.createUser,
);

router.patch('/:id/assign-role',
    checkAuth(Role.ADMIN),
    validateRequest(assignRoleZodSchema),
    userController.assignRole,
);

export const UserRoutes = router;
