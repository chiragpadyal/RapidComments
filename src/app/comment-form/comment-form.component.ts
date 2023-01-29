import { Component, Input } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { CommentsService } from "../comments.service";
// import { Comment } from "../models/Comments.model";
import { CommentNew } from "../models/CommentNew.model";
import { Comment } from "../models/Comments.model";
import { Reply } from "../models/Reply.model";
import { User } from "../models/User.model";

@Component({
  selector: "app-comment-form",
  templateUrl: "./comment-form.component.html",
  styleUrls: ["./comment-form.component.css"],
})
export class CommentFormComponent {
  @Input()
  commentMessage: String = "";

  @Input()
  commentId: String = "";

  @Input()
  hasCancelButton: boolean = true;

  @Input()
  hasCancelButtonForReply: boolean = true;

  commentVal: CommentNew = {
    message: "",
    user: 0,
    thread: "",
  };

  replyVal: Reply = {
    message: "",
    user: 0,
    thread: "",
    parentComments: {
      id: "",
    },
  };

  @Input()
  buttonVal: string = "Submit";
  constructor(
    private commentService: CommentsService,
    private auth: AuthService
  ) {}

  handleCancle() {
    console.log("handle from form comp");
  }

  // handleSubmit() {
  //   console.log("handle from form comp");
  // }

  handleSubmit() {
    this.auth.user$.subscribe({
      next: (data) => {
        let thread = localStorage.getItem("threadId");
        if (data && typeof data !== "undefined") {
          if (typeof data.sub === "string") {
            this.commentService.getUser(data.sub).subscribe({
              next: (e: User) => {
                this.commentVal.user = e.id;
                this.commentVal.message = this.commentMessage;
                if (thread) this.commentVal.thread = thread;
                this.commentService.createComments(this.commentVal).subscribe({
                  next: (e: Comment) => {
                    console.log(Comment);
                  },
                  error: () => {},
                });
              },
              error: () => {},
              complete: () => {
                this.commentMessage = "";
              },
            });
          }
        }
      },
      error: () => {},
    });
  }

  handleUpdate() {
    this.auth.user$.subscribe({
      next: (data) => {
        let thread = localStorage.getItem("threadId");
        if (data && typeof data !== "undefined") {
          if (typeof data.sub === "string") {
            this.commentService.getUser(data.sub).subscribe({
              next: (e: User) => {
                this.commentVal.user = e.id;
                this.commentVal.message = this.commentMessage;
                if (thread) this.commentVal.thread = thread;
                this.commentService
                  .updateCommentsById(this.commentId, this.commentVal)
                  .subscribe({
                    next: (e: Comment) => {
                      console.log(Comment);
                    },
                    error: () => {},
                  });
              },
              error: () => {},
              complete: () => {
                this.commentMessage = "";
              },
            });
          }
        }
      },
      error: () => {},
    });
  }

  handleReply() {
    this.auth.user$.subscribe({
      next: (data) => {
        let thread = localStorage.getItem("threadId");
        if (data && typeof data !== "undefined") {
          if (typeof data.sub === "string") {
            this.commentService.getUser(data.sub).subscribe({
              next: (e: User) => {
                this.replyVal.user = e.id;
                this.replyVal.message = this.commentMessage;
                if (thread) this.replyVal.thread = thread;
                this.replyVal.parentComments["id"] = this.commentId;
                this.commentService.createReply(this.replyVal).subscribe({
                  next: (e: Comment) => {
                    console.log(Comment);
                  },
                  error: () => {},
                });
              },
              error: () => {},
              complete: () => {
                this.commentMessage = "";
              },
            });
          }
        }
      },
      error: () => {},
    });
  }

  handleCancel() {
    this.hasCancelButton = false;
  }
}
