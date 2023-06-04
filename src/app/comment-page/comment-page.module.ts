import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommentPageComponent } from "./comment-page.component";
import { CommentFormComponent } from "./comment-form/comment-form.component";
import { CommentsComponent } from "./comments/comments.component";
import { QuillModule } from "ngx-quill";
import { SafeHtmlPipe } from "./safe-html.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
@NgModule({
  declarations: [
    CommentPageComponent,
    CommentFormComponent,
    CommentsComponent,
    SafeHtmlPipe,
  ],
  imports: [CommonModule, QuillModule.forRoot(), NgbModule, FormsModule],
})
export class CommentPageModule {}
