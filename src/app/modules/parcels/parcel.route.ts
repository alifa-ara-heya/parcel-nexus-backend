import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { parcelController } from './parcel.controller';
import { assignDeliveryManZodSchema, createParcelZodSchema, updateParcelStatusZodSchema } from './parcel.validation';
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

router.get('/my-deliveries',
    checkAuth(Role.DELIVERY_MAN),
    parcelController.getMyDeliveries
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

router.patch('/:id/assign',
    checkAuth(Role.ADMIN),
    validateRequest(assignDeliveryManZodSchema),
    parcelController.assignDeliveryMan
);

router.patch('/:id/update-delivery-status',
    checkAuth(Role.DELIVERY_MAN, Role.ADMIN),
    validateRequest(updateParcelStatusZodSchema),
    parcelController.updateDeliveryStatus
);

router.patch('/:id/block',
    checkAuth(Role.ADMIN),
    parcelController.blockParcel
);

router.patch('/:id/unblock',
    checkAuth(Role.ADMIN),
    parcelController.unblockParcel
);

export const ParcelRoutes = router;