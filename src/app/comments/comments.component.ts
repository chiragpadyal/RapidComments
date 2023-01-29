import { Component, Input, OnInit } from "@angular/core";
import { CommentsService } from "../comments.service";
import { Comment } from "../models/Comments.model";
import { LikeDislike } from "../models/LikeDislike.model";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit {
  @Input()
  comments: Comment = new Comment();

  @Input()
  replyTo: String = "";

  commentMessage: String = "";
  hasCancelButton: boolean = false;
  hasCancelButtonForReply: boolean = false;
  commentData: LikeDislike = new LikeDislike();
  constructor(private commentService: CommentsService) {}

  handleCancle() {
    console.log("handle from comp");
  }

  handleSubmit() {
    console.log("handle from comp");
  }

  ngOnInit(): void {}

  //  Like and Dislike
  likeComment(commentId: String): void {
    this.commentService.likeComment(commentId).subscribe({
      next: (e) => {
        console.log(e);
      },
      error: () => {},
    });
  }
  dislikeComment(commentId: String): void {
    this.commentService.dislikeComment(commentId).subscribe({
      next: (e) => {
        console.log(e);
      },
      error: () => {},
    });
  }

  // getCommentProp(commentId: String) {
  //   this.commentService.getCommentProp(commentId).subscribe({
  //     next: (e: LikeDislike) => {
  //       this.commentData = e;
  //     },
  //     error: () => {},
  //   });
  // }
}
