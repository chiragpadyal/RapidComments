import { Thread } from "./Thread.model";
import { User } from "./User.model";

export class Comment {
  "id": String;
  "message": String;
  "createdAt": String;
  "linkedComments": Comment[];
  "user": User;
  "thread": Thread;
}
