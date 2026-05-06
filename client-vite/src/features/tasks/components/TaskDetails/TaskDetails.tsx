import { useEffect, useRef, useState } from "react";
import { Task } from "../../types/task.types";
import { MdTask } from "react-icons/md";
import { MdOutlineContentCopy } from "react-icons/md";
import { RichTextEditor } from "../../../../components/RichTextEditor/RichTextEditor";

import "./TaskDetails.scss";
import { useLocation } from "react-router";
import { getPriorityIcon } from "../../../../utils/priority.utils";
import { beautifyText } from "../../../../utils/text.utils";
import { tasksApi } from "../../api/tasksApi";
import { uploadsApi } from "../../../../api/uploadsApi";
import { CommentsSection } from "./CommentsSection/CommentsSection";
import { useAuth } from "../../../auth/hooks/AuthContext";
import { User } from "../../../auth/types/auth.types";
import { usersApi } from "../../../../api/usersApi";

export interface TaskDetailsProps {
  task: Task;
  onCardUpdate?: (updatedTask: Task) => void;
}

export const TaskDetails = ({ task, onCardUpdate }: TaskDetailsProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(task?.description);
  const [assignee, setAssignee] = useState<User | undefined>();

  const { user } = useAuth();
  const location = useLocation();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    setIsEditingDescription(false);
    setDescription(task?.description);
    if (task?.assignee) {
      loadAssignee(task.assignee);
    } else {
      setAssignee(undefined);
    }
    return () => clearTimeout(saveTimerRef.current);
  }, [task?.id, task?.assignee]);

  const loadAssignee = async (id: string) => {
    const result = await usersApi.getById(id);
    setAssignee(result);
  };

  const saveDescription = async (newDescription: string) => {
    await tasksApi
      .update(task.id, { ...task, description: newDescription })
      .catch((err) => {
        console.error("Failed to save description: ", err);
      });
    onCardUpdate?.({ ...task, description: newDescription });
  };

  const saveComment = async (text: string) => {
    const newComment = {
      user: user?.id || "",
      text,
      createdAt: new Date(),
    };
    const updatedComments = [...(task?.comments || []), newComment];
    console.log({ ...task, comments: updatedComments });
    await tasksApi
      .update(task.id, { ...task, comments: updatedComments })
      .catch((err) => {
        console.error("Failed to save comment: ", err);
      });
    onCardUpdate?.({ ...task, comments: updatedComments });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  const onDescriptionChange = (newDescription: string) => {
    clearTimeout(saveTimerRef.current);
    setDescription(newDescription);
    saveTimerRef.current = setTimeout(
      () => saveDescription(newDescription),
      500,
    );
  };

  const onCommentSubmit = (newComment: string) => {
    saveComment(newComment);
  };

  return (
    <div
      className="modal fade"
      id="taskDetails"
      role="dialog"
      tabIndex={-1}
      ref={modalRef}
      aria-labelledby="taskDetailsLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content task-details-card">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="taskDetailsLabel">
              <MdTask color="var(--color-primary)" /> Task Details : {task?.id}{" "}
              <button
                onClick={() =>
                  copyToClipboard("localhost:5173" + location.pathname)
                }
              >
                <MdOutlineContentCopy />
              </button>
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body ">
            <div className="d-flex flex-row">
              <div className="col-8 task-content">
                <div className="d-flex flex-column">
                  <div>
                    <div className="mb-3 p-2">
                      <h2 className="task-title">
                        {beautifyText(task?.title)}
                      </h2>
                      <div className="d-flex flex-row gap-2 ">
                        {task?.priority && (
                          <span className="priority-badge badge p-2 px-3 d-flex align-items-center">
                            {getPriorityIcon(task?.priority || "")}{" "}
                            {beautifyText(task?.priority || "")}
                          </span>
                        )}
                        <span className="status-badge badge bg-primary p-2 px-3 d-flex align-items-center">
                          <div className="dot-white"></div>
                          {beautifyText(task?.status || "")}
                        </span>
                      </div>
                    </div>
                    <div className="mx-2 mb-3 p-2">
                      <h4 className="mb-2 sub-title">Description</h4>
                      <div className="me-3">
                        {isEditingDescription ? (
                          <>
                            <RichTextEditor
                              content={task?.description}
                              onChange={onDescriptionChange}
                              onUpload={(file) =>
                                uploadsApi.upload(file).then((r) => r.secureUrl)
                              }
                              placeholder="Type your issue description…"
                            />
                            <div className="description-buttons">
                              <button
                                className="cancel"
                                onClick={() => {
                                  setIsEditingDescription(false);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="submit"
                                onClick={() => {
                                  saveDescription(description || "");
                                  setIsEditingDescription(false);
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        ) : (
                          <div
                            className="description-text description-preview"
                            onClick={() => setIsEditingDescription(true)}
                            dangerouslySetInnerHTML={{
                              __html:
                                task?.description ||
                                '<p class="description-placeholder">Add a description…</p>',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mx-2 mb-3 p-2">
                    <h4 className="mb-2 sub-title">Activity & Comments</h4>
                    <CommentsSection
                      onCommentSubmit={onCommentSubmit}
                      comments={task?.comments}
                    />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex flex-column">
                  <div className="assignee-container">
                    <h4 className="sub-title">Assignee</h4>
                    <div className="member-avatar">
                      {assignee && (
                        <>
                          {assignee?.avatarUrl ? (
                            <img
                              src={assignee?.avatarUrl}
                              alt={assignee?.firstName}
                            />
                          ) : (
                            <span>
                              {assignee?.firstName[0]}
                              {assignee?.lastName[0]}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="sub-title mb-2">Properties</h4>
                    <span>Due Date : </span>
                    <span>Creation Date : </span>
                    <span>Point estimation : </span>
                  </div>
                  <div>
                    <h4 className="sub-title mb-2">Tags</h4>
                    <span>Tag 1, Tag 2, Tag 3</span>
                  </div>
                  <div>
                    <button>Delete Task</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">footer</div>
        </div>
      </div>
    </div>
  );
};
