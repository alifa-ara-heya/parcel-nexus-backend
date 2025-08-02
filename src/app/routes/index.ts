import { Router } from "express";
import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

export const router = Router();

import { ParcelRoutes } from "../modules/parcels/parcel.route";

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/parcels",
        route: ParcelRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route as Router)
})