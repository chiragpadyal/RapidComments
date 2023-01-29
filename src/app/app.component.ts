import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { CommentsService } from "./comments.service";
import { Comment } from "./models/Comments.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  comments: Comment[] = [];
  title = "RapidComment";
  threadId = "0aae614b-ddb1-42ce-ae44-ce1c0670badb";

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    private commentsService: CommentsService
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

    this.commentsService.getCommentsByThread(this.threadId).subscribe({
      next: (data: Comment[]) => {
        this.comments = data;
      },
      error: () => {},
    });
  }
}
