import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    likesInfo: {
        type:
            {
                likes: {type: Number, required: true},
                dislikes: {type: Number, required: true},
            },
        required: true},
})


export const CommentModel = mongoose.model("comments", CommentSchema)
