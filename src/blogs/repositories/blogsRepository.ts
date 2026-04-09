import {Blog} from "../types/blog.js";
import {BlogInputDto} from "../dto/blog-input.dto.js";
import {ObjectId, WithId} from "mongodb";
import {blogsCollection} from "../../db/mongo.db.js";
import {injectable} from "inversify";
import {BlogModel} from "../model/blogModel.js";

@injectable()
export class BlogsRepository {

    async findById(id: string): Promise<Blog | null> {
        // const blog = await blogsCollection.findOne({_id: new ObjectId(id)});
        const blog = await BlogModel.findById(id);
        console.log(blog);
        return blog;
    }

    async create(blog: Blog): Promise<string> {
        const insertResult = await BlogModel.insertOne(blog);
        return insertResult.id;

    }

    async update(id: string, dto: BlogInputDto): Promise<boolean> {
        // const updateResult = await blogsCollection.updateOne(
        //     {_id: new ObjectId(id)},
        //     {$set:
        //             {
        //                 name: dto.name,
        //                 description: dto.description,
        //                 websiteUrl: dto.websiteUrl,
        //             }
        //     }
        //     );
        // return updateResult.matchedCount;

        const foundBlog = await BlogModel.findById(id);
        if(!foundBlog) {
            return false
        }
        foundBlog.name = dto.name;
        foundBlog.description = dto.description;
        foundBlog.websiteUrl = dto.websiteUrl;

        foundBlog.save();
        return true;

    }

    async delete(id: string): Promise<boolean> {
        const deleteResult = await BlogModel.deleteOne({_id: id});
        if (deleteResult.deletedCount === 0) {
            return false;
        }
        return true;
    }
}