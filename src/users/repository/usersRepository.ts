import {User} from "../types/user";
import {usersCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {

    async findById(id: string): Promise<WithId<User> | null> {
        console.log(id)
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        console.log(user);
        return user;
    },

    async findByConfirmationCode(confirmationCode: string): Promise< WithId<User>| null> {
        const user = await usersCollection.findOne({"emailConfirmation.confirmationCode": confirmationCode});
        if (!user) {
            return null;
        }
        return user
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User>[]>{
        const user = await usersCollection
            .find({
                $or: [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
            }).toArray();
        return user;
    },
    async create(newUser: User): Promise<string> {
        console.log(111111111111111111)
        console.log(newUser);
        const insertResult = await usersCollection.insertOne(newUser);
        return insertResult.insertedId.toString();
    },

    async updateConfirmationStatus(email: string): Promise<number> {
        const updateResult = await usersCollection.updateOne(
            {email: email},
            {$set:
                    {
                        "emailConfirmation.isConfirmed": true
                    }
            }
        );
        return updateResult.matchedCount;
    },

    async deleteById (id: string): Promise<number> {
        const deleteResult = await usersCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount
    },

    async isLoginUnique(login: string): Promise<boolean> {
        const verificationResult = await usersCollection.
        find({login: login}).toArray();
        return verificationResult.length > 0
    },

    async isEmailUnique(email: string): Promise<boolean> {
        const verificationResult = await usersCollection.
        find({email: email}).toArray();
        return verificationResult.length > 0
    },
}