import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
} from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { map, take } from "rxjs";
import { CommentsService } from "../comments.service";
import { Page } from "../models/Page.model";
import { User } from "../models/User.model";
import { Comment } from "../models/Comments.model";

@Component({
  selector: "app-comment-page",
  templateUrl: "./comment-page.component.html",
  styleUrls: ["./comment-page.component.css"],
})
export class CommentPageComponent {
  comments: Comment[] = [];
  title = "RapidComment";
  threadId = "1";
  pageNo: number = 0;
  totalPage: number = 1;
  currentPage: number = 0;
  receivedData: Comment = new Comment();

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private commentsService: CommentsService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    localStorage.setItem("threadId", this.threadId);
    this.auth.isAuthenticated$.subscribe((data) => {
      if (data) {
        this.auth.getAccessTokenSilently().subscribe((data) => {
          console.log(data);
        });
      }
    });

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
            let user: User = new User();
            user.user_id = sub;
            this.commentsService
              .getCommentsByThreadByPage(this.threadId, this.pageNo, user)
              .subscribe({
                next: (data: Page) => {
                  this.comments = data.comments;
                  this.totalPage = data.totalPages;
                  this.currentPage = data.currentPage;
                  this.cd.detectChanges(); // manually trigger change detection
                },
                error: () => {},
              });
          }
        },
        error: () => {},
      });
  }

  nextPage() {
    if (this.totalPage > this.currentPage + 1) {
      // console.log(
      //   `currentPage: ${this.currentPage} TotalPage ${this.totalPage} PageNo. ${
      //     this.pageNo + 1
      //   } Comments: ${this.comments[0]["content"]}`
      // );

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
              let user: User = new User();
              user.user_id = sub;
              this.pageNo = this.currentPage + 1;
              this.commentsService
                .getCommentsByThreadByPage(this.threadId, this.pageNo, user)
                .subscribe({
                  next: (data: Page) => {
                    this.comments.push(...data.comments);
                    this.totalPage = data.totalPages;
                    this.currentPage = data.currentPage;
                    this.cd.detectChanges();
                  },
                  error: () => {},
                });
            }
          },
          error: () => {},
        });
    }
  }

  receiveData(data: Comment) {
    this.receivedData = data;
    // console.log(data.content);
    this.comments.unshift(data);
    this.cd.detectChanges();
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // Load Your Data Here
      this.nextPage();
    }
  }
}
