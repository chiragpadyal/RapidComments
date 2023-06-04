import { Comment } from "./Comments.model";

export class Page {
  "totalItems": number;
  "comments": Comment[];
  "totalPages": number;
  "currentPage": number;
}
