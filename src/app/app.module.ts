import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

import { AuthHttpInterceptor, AuthModule } from "@auth0/auth0-angular";
import { CommentsComponent } from "./comments/comments.component";
import { CommentFormComponent } from "./comment-form/comment-form.component";

@NgModule({
  declarations: [
    AppComponent,
    CommentsComponent,
    CommentFormComponent,
    ProductPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,

    AuthModule.forRoot({
      domain: "dev-qx1buviid5yofprn.us.auth0.com",
      clientId: "OwC91EEAljZBjrZ8ISSaZjPSyCwNlpLG",
      audience: "http://localhost:8080",
      httpInterceptor: {
        allowedList: [`http://localhost:8080/*`],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
