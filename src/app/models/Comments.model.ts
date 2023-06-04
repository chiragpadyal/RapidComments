import { CommentMeta } from "./CommentMeta.model";
import { Thread } from "./Thread.model";
import { User } from "./User.model";

export class Comment {
  "id": number;
  "content": String;
  "createdAt": String;
  "lastModified": String;
  "parentId": String;
  "children": Comment[];
  "user": User;
  "thread": Thread;
  "likes": number;
  "dislikes": number;
  "vote": CommentMeta[];
  "hasMore": boolean;
}
