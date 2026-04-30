import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";

// api
import { usersApi } from "../../../../api/usersApi";

// types
import { User } from "../../../auth/types/auth.types";
import { Task } from "../../types/task.types";

// utils
import TomSelect from "tom-select";
import { toast } from "react-toastify";

// styles
import "./TaskModal.scss";
import "tom-select/dist/css/tom-select.css";

interface TaskFormData {
  title: string;
  description: string;
  project: string;
  status: string;
  assignee: string;
  priority: string;
  dueDate: string;
}

interface TaskModalProps {
  onTaskAdd: (taskData: Omit<Task, "id" | "createdAt">) => Promise<boolean>;
  columns: string[];
}

export const TaskModal = ({ columns, ...props }: TaskModalProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    project: "",
    assignee: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<User[] | null>(null);

  const selectRef = useRef<HTMLSelectElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskData = formatTaskData(formData);
    try {
      const creationSucceed = await props.onTaskAdd(taskData);
      if (creationSucceed) {
        toast.success("Board created successfully!");
        closeModal();
      }

      // Optionally, you can reset the form or close the modal here
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create board.");
      closeModal();
    }
  };

  const formatTaskData = (data: TaskFormData) => {
    return {
      title: data.title,
      description: data.description,
      project: data.project,
      assignee: data.assignee,
      status: data?.status || columns[0],
      priority: data.priority || undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    } as Omit<Task, "id" | "createdAt">;
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    usersApi.getAll().then((users) => {
      setUsers(users);
      setLoadingUsers(false);
    });
  };

  const closeModal = () => {
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      status: "",
      priority: "",
      dueDate: "",
    });

    (document.activeElement as HTMLElement)?.blur();

    const el = selectRef.current;
    if (el && el.tomselect) {
      el.tomselect.clear();
    }

    document.getElementById("closeModalButton")?.click();
  };

  useEffect(() => {
    if (!selectRef.current) return;

    if (loadingUsers) {
      // Load users and initialize TomSelect after users are loaded
      const loadUsers = async () => {
        fetchUsers();
      };
      loadUsers();
    } else {
      // Prevent double initialization
      if (selectRef.current && !selectRef.current.tomselect) {
        new TomSelect(selectRef.current, {
          create: false,
        });
      }
    }
  }, [loadingUsers]);

  return (
    <div
      className="modal fade"
      id="taskModal"
      role="dialog"
      tabIndex={-1}
      ref={modalRef}
      aria-labelledby="taskModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create new task
              </h5>
              <button
                type="button"
                className="btn-close"
                id="closeModalButton"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body container justify-content-center d-flex">
              <div className="pb-3 container">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    required
                    className="form-control"
                  />
                </div>
                <div className="mb-3 d-flex flex-row">
                  <div className="col-6 pe-2">
                    <label htmlFor="select-assignee" className="form-label">
                      Assignee
                    </label>
                    <select
                      id="select-assignee"
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleChange}
                      ref={selectRef}
                      className="form-control"
                    >
                      <option value="">Select assignee</option>
                      {!loadingUsers &&
                        users?.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-6 ps-2">
                    <label htmlFor="dueDate" className="form-label">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="mb-3 d-flex flex-row">
                  <div className="col-6 pe-2">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select status</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 ps-2">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
