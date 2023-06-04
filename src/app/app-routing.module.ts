import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { CommentPageComponent } from "./comment-page/comment-page.component";
import { ProductPageComponent } from "./product-page/product-page.component";
const routes: Routes = [
  { path: "", component: ProductPageComponent },
  { path: "comments", component: CommentPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
