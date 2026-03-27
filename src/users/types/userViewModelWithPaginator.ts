import {UserViewModel} from "./userViewModel.js";

export type UserViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}