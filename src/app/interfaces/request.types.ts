import { Request } from 'express';
import { CustomJwtPayload } from '.';
// import { CustomJwtPayload } from './index.d';

export interface AuthenticatedRequest extends Request {
    user: CustomJwtPayload;
}
