import {HydratedDocument} from 'mongoose';
import {Blog} from "./blog.js";

export type BlogDocument = HydratedDocument<Blog>;