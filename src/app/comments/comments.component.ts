import { ViewportScroller } from "@angular/common";
import { Component, Input, OnInit, ChangeDetectorRef } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { map, take } from "rxjs";
import { CommentsService } from "../comments.service";
import { CommentMeta, Vote } from "../models/CommentMeta.model";
import { Comment } from "../models/Comments.model";
import { Page } from "../models/Page.model";
import { User } from "../models/User.model";

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.css"],
})
export class CommentsComponent implements OnInit {
  @Input()
  comments: Comment = new Comment();
  @Input()
  totalPage: number = 1;
  @Input()
  currentPage: number = 0;

  isLast: boolean = false;

  voteData = Vote;
  threadId: String = "1";

  @Input()
  replyTo: String = "";

  receivedData: Comment = new Comment();

  commentMessage: String = "";
  hasCancelButton: boolean = false;
  hasCancelButtonForReply: boolean = false;

  likeState: boolean = false;
  dislikeState: boolean = false;

  constructor(
    private commentService: CommentsService,
    private viewportScroller: ViewportScroller,
    private commentsService: CommentsService,
    private cd: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  handleCancle() {
    console.log("handle from comp");
  }

  handleSubmit() {
    console.log("handle from comp");
  }

  scrollToElement(id: string): void {
    this.viewportScroller.scrollToAnchor(`${id}`);
  }

  ngOnInit(): void {
    this.updateLikeDislikeState();
  }

  nextReply(comments: Comment) {
    if (comments.children.length >= 2) {
      this.commentsService
        .getRepliesByThreadByPage(this.threadId, comments, this.currentPage + 1)
        .subscribe({
          next: (data: Page) => {
            this.comments.children.push(...data.comments[0].children);
            this.totalPage = data.totalPages;
            this.currentPage = data.currentPage;
            this.isLast = data.totalPages - 1 <= data.currentPage;
            console.log(
              `Current page: ${data.currentPage} Total page: ${
                data.totalPages - 1
              } Last: ${this.isLast}`
            );
            this.cd.detectChanges();
          },
          error: () => {},
        });
    }
  }

  vote(comment: Comment, vote: Vote) {
    let commentVal: Comment = new Comment();
    let commentMeta: CommentMeta = new CommentMeta();

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
            // commentVal.content = this.commentMessage;
            //   commentVal.user = new User();
            // }
            // commentVal.user.user_id = sub;
            commentVal.id = comment.id;
            commentMeta.comment = commentVal;
            commentMeta.vote = vote;
            if (!commentVal.user) commentMeta.user = new User();
            commentMeta.user.user_id = sub;
            this.commentService.voteComment(thread, commentMeta).subscribe({
              next: (data: CommentMeta) => {
                console.log("done");
                // if (vote == Vote.LIKE) this.comments.vote[0].vote = 1;
                // if (vote == Vote.DISLIKE) this.comments.vote[0].vote = 0;
                // if (vote == Vote.NULL) this.comments.vote[0].vote = 2;
                console.log(
                  `Previous likestate: ${this.likeState} dislikeState: ${this.dislikeState}`
                );

                if (vote == Vote.LIKE) {
                  if (!this.likeState) this.comments.likes += 1;
                  else this.comments.likes -= 1;
                  if (this.dislikeState) this.comments.dislikes -= 1;
                  this.likeState = !this.likeState;
                  this.dislikeState = false;
                }
                if (vote == Vote.DISLIKE) {
                  if (!this.dislikeState) this.comments.dislikes += 1;
                  else this.comments.dislikes -= 1;
                  if (this.likeState) this.comments.likes -= 1;
                  this.dislikeState = !this.dislikeState;
                  this.likeState = false;
                }
                console.log(
                  `Now likestate: ${this.likeState} dislikeState: ${this.dislikeState}`
                );
                // if (vote == Vote.NULL) {
                //   this.likeState = false;
                //   this.dislikeState = false;
                // }
                // this.updateLikeDislikeState();
                // this.comments.likes = data.comment?.likes ? data.comment?.likes : 0;
                // this.comments.dislikes = data.comment.dislikes;
                this.cd.detectChanges();
              },
              error: () => {
                console.log("failed");
              },
            });
          }
        },
        error: () => {},
      });
  }

  receiveData(data: Comment) {
    this.receivedData = data;
    this.comments.children.unshift(this.receivedData);
    this.hasCancelButtonForReply = false;
    this.cd.detectChanges();
  }

  updateLikeDislikeState() {
    if (this.likeState) {
    } else if (this.dislikeState) {
    } else {
      if (this.comments.vote?.[0]?.vote == 0) {
        this.likeState = false;
        this.dislikeState = true;
      }
      if (this.comments.vote?.[0]?.vote == 1) {
        this.likeState = true;
        this.dislikeState = false;
      }
    }
  }
}
