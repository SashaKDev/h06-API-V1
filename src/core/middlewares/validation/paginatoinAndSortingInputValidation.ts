import {query} from 'express-validator';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_SORT_BY = 'createdAt'

enum sortByFields {
    createdAt = 'createdAt',
    name = 'name',
    description = 'description',
    websiteUrl = 'websiteUrl',
    id = 'id',
    title = 'title',
    shortDescription = 'shortDescription',
    content = 'content',
    blogId = 'blogId',
    postId = 'postId',
    blogName = 'blogName',
    login = 'login',
    email = 'email',
    commentatorInfo = 'commentatorInfo',
    userId = 'userId',
    userLogin = 'userLogin',
}

const pageNumberValidation = query('pageNumber')
    .default(DEFAULT_PAGE_NUMBER)
    .isInt({min: 1})
    .withMessage('pageNumber must be a positive integer')

const pageSizeValidation = query('pageSize')
    .default(DEFAULT_PAGE_SIZE)
    .isInt({min: 1})
    .withMessage('pageSize must be a positive integer')

const sortByValidation = query('sortBy')
    .default(DEFAULT_SORT_BY)
    .isIn(Object.values(sortByFields))
    // .withMessage('sortBy invalid value');

const sortDirectionValidation = query('sortDirection')
    .default(DEFAULT_SORT_DIRECTION)
    .isIn(['desc', 'asc'])
    .withMessage('sortDirection must be asc or desc')

const searchNameTermValidation = query('searchNameTerm')
    .default(null)

const searchLoginTermValidation = query('searchLoginTerm')
    .default(null)

const searchEmailTermValidation = query('searchEmailTerm')
    .default(null)


export const paginationAndSortingInputValidation = [
    pageNumberValidation,
    pageSizeValidation,
    sortByValidation,
    sortDirectionValidation,
    searchNameTermValidation,
    searchLoginTermValidation,
    searchEmailTermValidation
]

