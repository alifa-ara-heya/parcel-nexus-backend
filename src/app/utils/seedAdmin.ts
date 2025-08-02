import bcryptjs from 'bcryptjs';
// Making an admin if no admin exists when we restart our server 

import { envVars } from "../config/env"
import { User } from '../modules/users/user.model';
import { IAuthProvider, IUser, Role } from '../modules/users/user.interface';


export const createAdmin = async () => {
    try {
        const admin = await User.findOne({ email: envVars.ADMIN_EMAIL })

        if (admin) {
            console.log("Admin already exists");
            return
        }

        console.log('Trying to create admin');

        const hashedPassword = await bcryptjs.hash(envVars.ADMIN_PASSWORD, envVars.BCRYPT_SALT_ROUNDS)

        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.ADMIN_EMAIL
        }

        const payload: Partial<IUser> = {
            name: "Admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        }

        const superAdmin = await User.create(payload)

        console.log('Admin created successfully', superAdmin);

    } catch (error) {
        console.log(error)
    }
}