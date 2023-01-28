import CommentForm from "./CommentForm";
import React, { useState } from "react";
import up from './up.png';
import down from './down.png';
const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) => {


  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canDelete =
    currentUserId === comment.userId && replies.length === 0 && !timePassed;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId && !timePassed;
  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState("");

  const handleLikeClick = () => {
    if (action === "like") {
      setLikes(likes - 1);
      setAction("");
    } else {
      if (action === "dislike") {
        setDislikes(dislikes - 1);
      }
      setLikes(likes + 1);
      setAction("like");
    }
  };

  const handleDislikeClick = () => {
    if (action === "dislike") {
      setDislikes(dislikes - 1);
      setAction("");
    } else {
      if (action === "like") {
        setLikes(likes - 1);
      }
      setDislikes(dislikes + 1);
      setAction("dislike");
    }
  };
  return (
    <div key={comment.id} className="comment">
    <div className="comment-image-container">
      <img src="/user-icon.png" />
    </div>
    <div className="comment-right-part">
      <div className="comment-content">
        <div className="comment-author">{comment.username}</div>
        <div>{createdAt}</div>
      </div>
      {!isEditing && <div className="comment-text">{comment.body}</div>}
      {isEditing && (
        <CommentForm
          submitLabel="Update"
          hasCancelButton
          initialText={comment.body}
          handleSubmit={(text) => updateComment(text, comment.id)}
          handleCancel={() => {
            setActiveComment(null);
          }}
        />
      )}
      <div className="comment-actions">
        {canReply && (
          <div
            className="comment-action"
            onClick={() => setActiveComment({ id: comment.id, type: "replying" })}
          >
            Reply
          </div>
        )}
        {canEdit && (
          <div
            className="comment-action"
            onClick={() =>
              setActiveComment({ id: comment.id, type: "editing" })
            }
          >
            Edit
          </div>
        )}
        {canDelete && (
          <div className="comment-action" onClick={() => deleteComment(comment.id)}>
            Delete
          </div>
        )}
      </div>
      <div className="upvote-downvote-actions">
      <button onClick={handleLikeClick}>
        <img src={up} alt="up" style={{ 
        width: '20px', 
        height: '20px', 
        objectFit: 'cover' }} />
        

      <span>{likes}</span>
      </button>
      
      
      <button onClick={handleDislikeClick}>
      <img src={down} alt="up"   style={{ 
        width: '20px', 
        height: '20px', 
        objectFit: 'cover' 
      }} />

      <span>{dislikes}</span>
      </button>
        
      </div>
      {isReplying && (
        <CommentForm
          submitLabel="Reply"
          handleSubmit={(text) => addComment(text, replyId)}
        />
      )}
      {replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <Comment
              comment={reply}
              key={reply.id}
              setActiveComment={setActiveComment}
              activeComment={activeComment}
              updateComment={updateComment}
              deleteComment={deleteComment}
              addComment={addComment}
              parentId={comment.id}
              replies={[]}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default Comment;