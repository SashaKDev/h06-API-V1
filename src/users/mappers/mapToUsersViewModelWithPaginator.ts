import {UserViewModel} from "../types/userViewModel.js";
import {UserViewModelWithPaginator} from "../types/userViewModelWithPaginator.js";

export const mapToUsersViewModelWithPaginator = (foundUsersViewModel: UserViewModel[], totalCount: number,
                                                 pageSize: number, pageNumber:number): UserViewModelWithPaginator => {

    return {
        totalCount: totalCount,
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        items: foundUsersViewModel
    }

}