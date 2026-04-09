export type CommentType = {
    postId: string,
    content: string,
    createdAt: string,
    userId: string,
    userLogin: string,
    likesInfo: {
        likes: number,
        dislikes: number,
    }
}