// import mongoose from "mongoose";
//
// const BlogSchema = new mongoose.Schema({
//     name: {type: String, required: true},
//     description: {type: String, required: true},
//     websiteUrl: {type: String, required: true},
//     createdAt: {type: String, required: true},
//     isMembership: {type: Boolean, required: true},
// })
//
// export const BlogModel = mongoose.model("blogs", BlogSchema)

import {Blog} from "../types/blog.js";
import {HydratedDocument, Model, model} from "mongoose"
import mongoose from "mongoose"
import {BlogInputDto} from "../dto/blog-input.dto.js";

interface BlogMethods {
    listMainInfo(): void
}

type BlogStatics = typeof BlogEntity;

type BlogModel = Model<Blog, {}, BlogMethods> & BlogStatics;

export type BlogDocument = HydratedDocument<Blog, BlogMethods>;

const blogSchema = new mongoose.Schema<Blog, BlogModel, BlogMethods>(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        websiteUrl: {type: String, required: true},
        createdAt: {type: String, required: true},
        isMembership: {type: Boolean, required: true},
    }
);

class BlogEntity {
    private constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,
    ) {
    }

    static createBlog(dto: BlogInputDto) {
        const blog = new BlogModel(dto)
        blog.createdAt = new Date().toISOString();
        blog.isMembership = false
        return blog
    }

    listMainInfo() {
        console.log(`name: ${ this.name }`);
        console.log(`description: ${ this.description }`);
        console.log(`websiteUrl: ${ this.websiteUrl }`);
    }

}

blogSchema.loadClass(BlogEntity);

export const BlogModel = model<Blog, BlogModel>("blogs", blogSchema);

