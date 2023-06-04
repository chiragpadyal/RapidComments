import { Comment } from "./Comments.model";
import { User } from "./User.model";

export enum Vote {
  DISLIKE = 0,
  LIKE = 1,
  NULL = 2,
}

export class CommentMeta {
  "user": User;
  "comment": Comment;
  "vote": Vote;
}
