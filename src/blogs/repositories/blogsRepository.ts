import {Blog} from "../types/blog.js";
import {BlogInputDto} from "../dto/blog-input.dto.js";
import {ObjectId, WithId} from "mongodb";
import {blogsCollection} from "../../db/mongo.db.js";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {

    async findById(id: string): Promise<WithId<Blog> | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)});
        console.log(blog);
        return blog;
    }

    async create(blog: Blog): Promise<string> {
        const insertResult = await blogsCollection.insertOne(blog);
        return insertResult.insertedId.toString();

    }

    async update(id: string, dto: BlogInputDto): Promise<number> {
        const updateResult = await blogsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set:
                    {
                        name: dto.name,
                        description: dto.description,
                        websiteUrl: dto.websiteUrl,
                    }
            }
            );
        return updateResult.matchedCount;
    }

    async delete(id: string): Promise<number> {
        const deleteResult = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return deleteResult.deletedCount;
    }
}