export type CommentsViewModel = {
    id: string,
    content: string,
    createdAt: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    "likesInfo": {
        "likesCount": number,
        "dislikesCount": number,
        "myStatus": string
    }
}