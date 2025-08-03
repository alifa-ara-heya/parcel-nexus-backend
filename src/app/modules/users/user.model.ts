import bcrypt from "bcryptjs";
import { model, Query, Schema } from "mongoose";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive, IUser, IUserModel, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    _id: false
})


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        select: false //Best Practice: Hides the password from query results by default
    },

    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },

    phone: {
        type: String,
        required: false
    },

    picture: { type: String },
    address: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    auths: {
        type: [authProviderSchema]
    }
},
    {
        timestamps: true,
        versionKey: false
    })

// --------------------------------------------------
// VIRTUALS
// --------------------------------------------------

// Create a virtual property `userId` that gets the string representation of `_id`
userSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included when converting to JSON or a plain object
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// --------------------------------------------------
// MIDDLEWARE / HOOKS
// --------------------------------------------------

// pre-save middleware/hook to hash password
userSchema.pre("save", async function (next) {
    // `this` refers to the document being saved
    // Only hash the password if it has been modified (or is new) and is not null/undefined
    if (!this.isModified("password") || !this.password) {
        return next()
    }

    // hash the password
    this.password = await bcrypt.hash(
        this.password, // Now TypeScript knows `this.password` is a string
        Number(envVars.BCRYPT_SALT_ROUNDS));

    next()
})

// Query middleware for soft delete- automatically and invisibly filters out "deleted" documents from all my find queries(find, findOne, findById, findOneAndUpdate etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
userSchema.pre<Query<IUser, any>>(/^find/, function (next) {
    // This will apply to all find queries like find, findOne, findById, etc.
    this.where({ isDeleted: { $ne: true } })
    //  inside a query middleware, the this keyword does not refer to the document. Instead, this refers to the query object itself.
    next()
})

// Static method to check if the provided password is correct
userSchema.statics.isPasswordCorrect = async function (
    plainTextPassword: string,
    hashedPassword: string,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}


export const User = model<IUser, IUserModel>("User", userSchema)