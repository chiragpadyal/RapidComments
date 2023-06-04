import { User } from "@auth0/auth0-angular";

export class CommentNew {
  "message": String;
  "user": User;
  "thread": String;
}
