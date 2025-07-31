import { Router } from "express";
import { UserRoutes } from "../modules/users/user.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route as Router)
})