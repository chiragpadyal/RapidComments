import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Comment } from "./models/Comments.model";
import { CommentNew } from "./models/CommentNew.model";
import { User } from "./models/User.model";
import { Reply } from "./models/Reply.model";
import { LikeDislike } from "./models/LikeDislike.model";

@Injectable({
  providedIn: "root",
})
export class CommentsService {
  urlApi: String = "http://localhost:8080";

  constructor(private http: HttpClient) {}

  getCommentsByThread(threadId: String): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.urlApi}/api/getCommentsByThread/${threadId}`
    );
  }

  createComments(comment: CommentNew): Observable<Comment> {
    return this.http.post<Comment>(`${this.urlApi}/api/createComment`, comment);
  }

  createReply(comment: Reply): Observable<Comment> {
    return this.http.post<Comment>(`${this.urlApi}/api/createComment`, comment);
  }

  updateCommentsById(
    commentId: String,
    comment: CommentNew
  ): Observable<Comment> {
    return this.http.put<Comment>(
      `${this.urlApi}/api/updateComment/${commentId}`,
      comment
    );
  }

  // User data
  getUser(googleToken: string): Observable<User> {
    return this.http.post<User>(`${this.urlApi}/api/admin/users/getUser`, {
      user_id: googleToken,
    });
  }

  //  Like and Dislike
  likeComment(commentId: String): Observable<any> {
    return this.http.put<any>(
      `${this.urlApi}/api/updateComment/${commentId}/dislike`,
      {}
    );
  }
  dislikeComment(commentId: String): Observable<any> {
    return this.http.put<any>(
      `${this.urlApi}/api/updateComment/${commentId}/like`,
      {}
    );
  }

  getCommentProp(commentId: String): Observable<LikeDislike> {
    return this.http.get<LikeDislike>(
      `${this.urlApi}/api/getCommentProp/{commentId}`
    );
  }
}
