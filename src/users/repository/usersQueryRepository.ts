import {UserViewModel} from "../types/userViewModel";
import {usersCollection} from "../../db/mongo.db";
import {ObjectId} from "mongodb";
import {mapUserToViewModel} from "../mappers/mapUserToViewModel";
import {UsersPaginationData} from "../types/usersPaginationData";
import {UserViewModelWithPaginator} from "../types/userViewModelWithPaginator";
import {mapToUsersViewModelWithPaginator} from "../mappers/mapToUsersViewModelWithPaginator";

export const usersQueryRepository = {
    async findById(id: string): Promise<UserViewModel | null> {
        const foundUser = await usersCollection.findOne({_id: new ObjectId(id)});
        if (!foundUser) {
            return null;
        }
        return mapUserToViewModel(foundUser);
    },

    async findAll(data: UsersPaginationData): Promise<UserViewModelWithPaginator> {
        const skip = (data.pageNumber - 1) * data.pageSize;
        const limit = data.pageSize;
        const sortBy = data.sortBy;
        const sortDirectionNumber = data.sortDirection === 'desc' ? -1 : 1;

        let filter = {};

        if(data.searchLoginTerm){
            filter = {login: {$regex: data.searchLoginTerm, $options: 'i'} };
        }
        if(data.searchEmailTerm){
            filter = {email: {$regex: data.searchEmailTerm, $options: 'i'} };
        }
        if(data.searchLoginTerm && data.searchEmailTerm) {
            filter = { $or:
                    [
                        { login: { $regex: data.searchLoginTerm, $options: 'i' } },
                        { email: {$regex: data.searchEmailTerm, $options: 'i'} }
                    ] }
        }

        const foundUsers = await usersCollection
            .find(filter)
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalCount = await usersCollection.countDocuments(filter);
        console.log(totalCount);
        const foundUsersViewModel = foundUsers.map(mapUserToViewModel);
        return mapToUsersViewModelWithPaginator(foundUsersViewModel, totalCount, data.pageSize, data.pageNumber);
    }
}