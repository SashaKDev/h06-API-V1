export type Post = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    likesCount: {
        likesCount: number,
        dislikesCount: number,
    }
}