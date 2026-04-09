import {CommentType} from "./commentType.js";
import {HydratedDocument} from "mongoose"

export type CommentDocument = HydratedDocument<CommentType>