import { useRef } from "react";
import { Task } from "../../types/task.types";
import { MdTask } from "react-icons/md";
import { RichTextEditor } from "../../../../components/RichTextEditor/RichTextEditor";

export interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="taskDetailsLabel">
              Task Details : <MdTask color="var(--color-primary)" /> {task?.id}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <div className="d-flex flex-row">
              <div className="col-8">
                <div className="d-flex flex-column">
                  <div>
                    <div className="mb-3 p-2">
                      <h2>{task?.title}</h2>
                      <div className="d-flex flex-row gap-2 mx-4">
                        <span className="badge bg-secondary">
                          {task?.priority}
                        </span>
                        <span className="badge bg-primary">{task?.status}</span>
                      </div>
                    </div>
                    <div className="mx-2 mb-3 p-2">
                      <h4 className="mb-2">Description</h4>
                      <div className="mx-3">
                        <RichTextEditor
                          content={task?.description ?? ""}
                          placeholder="Type your issue description…"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mx-2 mb-3 p-2">
                    <h4>Activity & Comments</h4>
                    <div className="d-flex flex-column mx-3">
                      {/* Comment */}
                      <div className="d-flex flex-row">
                        <div className="col-2">Icon</div>
                        <div className="col-10 d-flex flex-column">
                          <div className="d-flex flex-row">
                            <div className="col-8 d-flex justify-content-start">
                              <h4>FirstName LastName</h4>
                            </div>
                            <div className="col-4 d-flex justify-content-end">
                              <span>Oct 24, 4:12PM</span>
                            </div>
                          </div>
                          <span>Comment written by user...</span>
                        </div>
                      </div>
                      {/* Comment */}

                      <div className="d-flex flex-row">
                        <div className="col-2">Icon</div>
                        <div className="col-10 d-flex flex-column">
                          <div className="d-flex flex-row">
                            <div className="col-8 d-flex justify-content-start">
                              <h4>FirstName LastName</h4>
                            </div>
                            <div className="col-4 d-flex justify-content-end">
                              <span>Oct 24, 4:12PM</span>
                            </div>
                          </div>
                          <span>Comment written by user...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex flex-column">
                  <div>
                    <h4>Assignee</h4>
                    <span>User</span>
                  </div>
                  <div>
                    <h4>Properties</h4>
                    <span>Due Date : </span>
                    <span>Creation Date : </span>
                    <span>Point estimation : </span>
                  </div>
                  <div>
                    <h4>Tags</h4>
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
