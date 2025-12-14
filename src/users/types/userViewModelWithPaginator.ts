import {UserViewModel} from "./userViewModel";

export type UserViewModelWithPaginator = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserViewModel[]
}