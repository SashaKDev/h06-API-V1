import {User} from "../types/user.js";
import {usersCollection} from "../../db/mongo.db.js";
import {injectable} from "inversify";
import {UserModel} from "../model/userModel.js";
import {UserDocument} from "../types/userDocument.js";

@injectable()
export class UsersRepository {
    async findById(id: string): Promise<UserDocument | null> {
        console.log(id)
        const user = await UserModel.findById(id)
        console.log(user);
        return user;
    }

    async findByConfirmationCode(confirmationCode: string): Promise<UserDocument | null> {
        const user = await UserModel.findOne({"emailConfirmation.confirmationCode": confirmationCode});
        if (!user) {
            return null;
        }
        return user
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument[]> {
        const user = await UserModel
            .find({
                $or: [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
            });
        return user;
    }

    async create(newUser: User): Promise<string> {
        const insertResult = await UserModel.insertOne(newUser);
        return insertResult.id;
    }

    async updateConfirmationStatus(email: string): Promise<number> {
        const foundUser = await UserModel.findOne({email: email});
        if (!foundUser) {
            return 0;
        }
        foundUser.emailConfirmation.isConfirmed = true;
        await foundUser.save();
        // const updateResult = await usersCollection.updateOne(
        //     {email: email},
        //     {
        //         $set:
        //             {
        //                 "emailConfirmation.isConfirmed": true
        //             }
        //     }
        // );
        return 1;
    }

    async updateConfirmationCode(email: string, newConfirmationCode: string): Promise<number> {

        const foundUser = await UserModel.findOne({email: email});
        if (!foundUser) {
            return 0;
        }
        foundUser.emailConfirmation.confirmationCode = newConfirmationCode;
        foundUser.save()

        // const updateResult = await usersCollection.updateOne(
        //     {email: email},
        //     {
        //         $set:
        //             {
        //                 "emailConfirmation.confirmationCode": newConfirmationCode
        //             }
        //     }
        // );
        return 1;
    }

    async updatePassword(userId: string, newPassword: string): Promise<number> {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return 0;
        }
        foundUser.password = newPassword;
        foundUser.save();

        // const updateResult = await usersCollection.updateOne(
        //     {_id: new ObjectId(userId)},
        //     {
        //         $set:
        //             {
        //                 password: newPassword,
        //
        //             }
        //     }
        // );
        return 1;
    }

    async updateRecoveryCodeIat (userId: string, iat: number): Promise<boolean> {

        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return false;
        }
        foundUser.recoveryCode.iat = iat;
        foundUser.save();
        return true;
        // await usersCollection.updateOne(
        //     {_id: new ObjectId(userId)},
        //     {
        //         $set:
        //             {
        //                 "recoveryCode.iat": iat,
        //
        //             }
        //     }
        // );
    }

    async deleteById(id: string): Promise<number> {
        const deleteResult = await UserModel.deleteOne({_id: id});
        return deleteResult.deletedCount
    }

    async isLoginUnique(login: string): Promise<boolean> {
        const verificationResult = await usersCollection.find({login: login}).toArray();
        return verificationResult.length > 0
    }

    async isEmailUnique(email: string): Promise<boolean> {
        const verificationResult = await usersCollection.find({email: email}).toArray();
        return verificationResult.length > 0
    }

    async changeUserLikesInfo(commentId: string,  likeStatus: string, userId: string): Promise<boolean> {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return false;
        }
        if (likeStatus === "Like"){
            foundUser.likesInfo.likes.push(commentId);
        }
        if (likeStatus === "Dislike"){
            foundUser.likesInfo.dislikes.push(commentId);
        }
        foundUser.save();
        return true;
    }

    async changeUserLikeStatusFromLikeOnDislike(userId: string, commentId: string ): Promise<boolean> {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return false;
        }
        foundUser.likesInfo.likes = foundUser.likesInfo.likes.filter(c => {
            return c !== commentId;
        })
        foundUser.likesInfo.dislikes.push(commentId);
        foundUser.save();
        return true;
    }

    async changeUserLikeStatusFromDislikeOnLike(userId: string, commentId: string ): Promise<boolean> {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return false;
        }
        foundUser.likesInfo.dislikes = foundUser.likesInfo.dislikes.filter(c => {
            return c !== commentId;
        })
        foundUser.likesInfo.likes.push(commentId);
        foundUser.save();
        return true;
    }

    async deleteUserLike(userId: string, commentId: string): Promise<boolean> {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return false;
        }
        foundUser.likesInfo.likes = foundUser.likesInfo.likes.filter(c => { return c!== commentId});
        foundUser.save();
        return true;
    }

    async deleteUserDislike(userId: string, commentId: string): Promise<boolean> {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return false;
        }
        foundUser.likesInfo.dislikes = foundUser.likesInfo.dislikes.filter(c => { return c!== commentId});
        foundUser.save();
        return true;
    }
}

// export const usersRepository = {
//
//     async findById(id: string): Promise<WithId<User> | null> {
//         console.log(id)
//         const user = await usersCollection.findOne({_id: new ObjectId(id)})
//         console.log(user);
//         return user;
//     },
//
//     async findByConfirmationCode(confirmationCode: string): Promise< WithId<User>| null> {
//         const user = await usersCollection.findOne({"emailConfirmation.confirmationCode": confirmationCode});
//         if (!user) {
//             return null;
//         }
//         return user
//     },
//
//     async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User>[]>{
//         const user = await usersCollection
//             .find({
//                 $or: [
//                     {login: loginOrEmail},
//                     {email: loginOrEmail}
//                 ]
//             }).toArray();
//         return user;
//     },
//     async create(newUser: User): Promise<string> {
//         console.log(111111111111111111)
//         console.log(newUser);
//         const insertResult = await usersCollection.insertOne(newUser);
//         return insertResult.insertedId.toString();
//     },
//
//     async updateConfirmationStatus(email: string): Promise<number> {
//         const updateResult = await usersCollection.updateOne(
//             {email: email},
//             {$set:
//                     {
//                         "emailConfirmation.isConfirmed": true
//                     }
//             }
//         );
//         return updateResult.matchedCount;
//     },
//
//     async updateConfirmationCode(email: string, newConfirmationCode: string ): Promise<number> {
//         const updateResult = await usersCollection.updateOne(
//             {email: email},
//             {$set:
//                     {
//                         "emailConfirmation.confirmationCode": newConfirmationCode
//                     }
//             }
//         );
//         return updateResult.matchedCount;
//     },
//
//     async deleteById (id: string): Promise<number> {
//         const deleteResult = await usersCollection.deleteOne({_id: new ObjectId(id)});
//         return deleteResult.deletedCount
//     },
//
//     async isLoginUnique(login: string): Promise<boolean> {
//         const verificationResult = await usersCollection.
//         find({login: login}).toArray();
//         return verificationResult.length > 0
//     },
//
//     async isEmailUnique(email: string): Promise<boolean> {
//         const verificationResult = await usersCollection.
//         find({email: email}).toArray();
//         return verificationResult.length > 0
//     },
// }