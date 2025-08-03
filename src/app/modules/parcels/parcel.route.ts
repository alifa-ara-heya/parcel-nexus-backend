import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { parcelController } from './parcel.controller';
import { createParcelZodSchema } from './parcel.validation';
import { Role } from '../users/user.interface';

const router = Router();

router.post('/',
    checkAuth(Role.USER),
    validateRequest(createParcelZodSchema),
    parcelController.createParcel
);

router.get('/me',
    checkAuth(Role.USER),
    parcelController.getMyParcels
);

router.get('/incoming',
    checkAuth(Role.USER),
    parcelController.getIncomingParcels
);

router.get('/all',
    checkAuth(Role.ADMIN),
    parcelController.getAllParcels
);

router.get('/:id',
    checkAuth(Role.USER, Role.ADMIN),
    parcelController.getParcelById
);

router.patch('/:id/cancel',
    checkAuth(Role.USER, Role.ADMIN),
    parcelController.cancelParcel
);

export const ParcelRoutes = router;