export class Reply {
  "message": String;
  "user": number;
  "thread": String;
  "parentComments": { [key: string]: String };
}
