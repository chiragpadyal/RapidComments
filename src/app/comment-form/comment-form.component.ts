import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { map, take } from "rxjs";
import { CommentsService } from "../comments.service";
// import { Comment } from "../models/Comments.model";
// import { CommentNew } from "../models/CommentNew.model";
import { Comment } from "../models/Comments.model";
import { Reply } from "../models/Reply.model";
import { User } from "../models/User.model";

import "quill-emoji/dist/quill-emoji.js";

// import { emojis } from "@nutrify/ngx-emoji-mart-picker/ngx-emoji/esm5/data/emojis";

@Component({
  selector: "app-comment-form",
  templateUrl: "./comment-form.component.html",
  styleUrls: ["./comment-form.component.css"],
})
export class CommentFormComponent {
  @Input()
  commentMessage: String = "";

  @Input()
  comment: Comment = new Comment();

  @Input()
  hasCancelButton: boolean = true;

  @Input()
  hasCancelButtonForReply: boolean = true;

  @Output() dataEvent = new EventEmitter<Comment>();
  @Output() dataEventToComment = new EventEmitter<Comment>();

  //emoji
  modules = {
    "emoji-shortname": true,
    "emoji-toolbar": true,
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["emoji"],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
      ],
    },
  };

  commentVal: Comment = new Comment();
  commentSend: Comment = new Comment();
  userSub: any;
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
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  handleCancle() {
    console.log("handle from form comp");
  }

  // handleSubmit() {
  //   console.log("handle from form comp");
  // }
  submitting: boolean = false;
  handleSubmit() {
    console.log("once"); //runs once
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    this.auth.user$
      .pipe(
        take(1),
        map((data) => data?.sub)
      )
      .subscribe({
        next: (sub) => {
          console.log(sub); //runs once
          let thread = localStorage.getItem("threadId");
          if (typeof sub === "string" && typeof thread === "string") {
            this.commentVal.content = this.commentMessage;
            if (!this.commentVal.user) {
              this.commentVal.user = new User();
            }
            this.commentVal.user.user_id = sub;
            this.commentService
              .createComments(this.commentVal, thread)
              .subscribe({
                next: (e: Comment) => {
                  this.commentSend = e;
                  this.commentMessage = "";
                  this.sendData();
                },
                error: () => {},
                complete: () => {
                  this.submitting = false; // set submitting to false on completion
                },
              });
          }
        },
        error: () => {},
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  handleReply() {
    console.log("once"); //runs once
    if (this.submitting) {
      return;
    }
    this.submitting = true;

    this.auth.user$
      .pipe(
        take(1),
        map((data) => data?.sub)
      )
      .subscribe({
        next: (sub) => {
          console.log(sub); //runs once
          let thread = localStorage.getItem("threadId");
          if (typeof sub === "string" && typeof thread === "string") {
            this.commentVal.content = this.commentMessage;
            if (!this.commentVal.user) {
              this.commentVal.user = new User();
            }
            this.commentVal.user.user_id = sub;
            this.commentVal.parentId = this.comment.id.toString();
            this.commentService
              .createComments(this.commentVal, thread)
              .subscribe({
                next: (e: Comment) => {
                  this.commentSend = e;
                  this.sendDataToComment();
                  this.commentMessage = "";
                  console.log(e);
                },
                error: () => {},
                complete: () => {
                  this.submitting = false; // set submitting to false on completion
                },
              });
          }
        },
        error: () => {},
      });
  }

  sendData() {
    this.dataEvent.emit(this.commentSend);
  }

  sendDataToComment() {
    this.dataEventToComment.emit(this.commentSend);
  }

  handleCancel() {
    this.hasCancelButton = false;
  }
}
