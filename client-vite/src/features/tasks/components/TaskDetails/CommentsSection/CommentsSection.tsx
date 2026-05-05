import { useEffect, useMemo, useState } from "react";
import "./CommentsSection.scss";
import { RichTextEditor } from "../../../../../components/RichTextEditor/RichTextEditor";
import { uploadsApi } from "../../../../../api/uploadsApi";
import { useAuth } from "../../../../auth/hooks/AuthContext";
import { Comment } from "../../../types/task.types";
import { formatDateTime } from "../../../../../utils/text.utils";
import DOMPurify from "dompurify";

interface CommentsSectionProps {
  onCommentSubmit: (comment: string) => void;
  comments: Comment[];
}

export const CommentsSection = ({
  onCommentSubmit,
  comments,
}: CommentsSectionProps) => {
  //   comments?.map((comment) => {
  //     comment.text = DOMPurify.sanitize(comment.text);
  //   });

  const [isWritting, setIsWritting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { user } = useAuth();

  const onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
    setCommentText("");
    setIsWritting(true);
  };

  // Prevent XSS by sanitizing comment text before rendering
  const renderedComments = useMemo(() => {
    return comments?.map((comment, index) => (
      <div className="d-flex flex-row comment-row mb-3" key={index}>
        <div className="member-avatar">
          {user && (
            <>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.firstName} />
              ) : (
                <span>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </span>
              )}
            </>
          )}
        </div>
        <div className="col d-flex flex-column">
          <div className="d-flex flex-row">
            <div className="col-8 d-flex justify-content-start">
              <h4 className="comment-name">
                {user?.firstName} {user?.lastName}
              </h4>
            </div>
            <div className="col-4 d-flex justify-content-end">
              <span className="comment-time">
                {formatDateTime(comment?.createdAt)}
              </span>
            </div>
          </div>

          <div
            className="comment-text px-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(comment?.text),
            }}
          />
        </div>
      </div>
    ));
  }, [comments, user]);

  return (
    <div className="d-flex flex-column mx-3">
      {/* Comments */}
      {renderedComments}

      <div className="comment-input">
        {isWritting ? (
          <div>
            <RichTextEditor
              content={commentText}
              onChange={setCommentText}
              onUpload={(file) =>
                uploadsApi.upload(file).then((r) => r.secureUrl)
              }
              placeholder="Write a comment..."
            />
            <div className="comment-buttons">
              <button
                className="cancel"
                onClick={() => setIsWritting(!isWritting)}
              >
                Cancel
              </button>
              <button
                className="submit"
                onClick={() => {
                  onCommentSubmit(commentText);
                  setIsWritting(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <input
            className="form-control"
            placeholder="Write a comment..."
            onClick={onInputClick}
          />
        )}
      </div>
    </div>
  );
};
