import {User} from "../types/user";
import {usersCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {UserDBType} from "../../auth/types/UserDBType";

export const usersRepository = {

    async findById(id: string): Promise<WithId<User> | null> {
        console.log(id)
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        console.log(user);
        return user;
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