import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likesCount: {
        type:
            {
                likesCount: {type: Number, required: true},
                dislikesCount: {type: Number, required: true},
            },
        required: true

    }
})

export const PostModel = mongoose.model("posts", PostSchema)