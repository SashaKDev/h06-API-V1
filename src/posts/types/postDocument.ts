import {HydratedDocument} from 'mongoose';
import {Post} from "./post.js";

export type PostDocument = HydratedDocument<Post>;