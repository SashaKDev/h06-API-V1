import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    login: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {
        type:
            {
                confirmationCode: {type: String, required: true},
                expirationDate: {type: Date, required: true},
                isConfirmed: {type: Boolean, required: true},
            },
        required: true,
    },
    recoveryCode: {
        type:
            {
                iat: {type: Number, required: true}
            },
        required: true,
    },
    likesInfo: {
        type: {
            likes: {type: [String], required: true},
            dislikes: {type: [String], required: true},
        }, required: true
    },
})

export const UserModel = mongoose.model("users", userSchema);
