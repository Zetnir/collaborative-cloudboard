import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";
import "./CreateBoardModal.scss";
import TomSelect from "tom-select";
import "tom-select/dist/css/tom-select.css";
import { usersApi } from "../../../api/usersApi";
import { User } from "../../../types/auth.types";

interface ProjectFormData {
  name: string;
  description: string;
  members: string[]; // Assuming members are represented by their IDs
}

export const CreateBoardModal = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    members: [],
  } as ProjectFormData);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<User[] | null>(null);

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value,
      );
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const project = formatProjectData(formData);
  };

  const formatProjectData = (data: ProjectFormData) => {
    return {
      name: data.name || "Untitled Board",
      description: data.description || "",
      members: data.members || [],
    };
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    usersApi.getAll().then((users) => {
      setUsers(users);
      setLoadingUsers(false);
    });
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
      if (!selectRef.current.tomselect) {
        new TomSelect(selectRef.current, {
          plugins: ["remove_button"],
          create: false,
        });
      }
    }
  }, [loadingUsers]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create New Board
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body container justify-content-center d-flex">
              <div className="pb-3 container">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
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
                <div className="mb-3">
                  <label htmlFor="select-members" className="form-label">
                    Members
                  </label>
                  <select
                    multiple
                    id="select-members"
                    name="members"
                    value={formData.members}
                    onChange={handleChange}
                    ref={selectRef}
                    className="form-control"
                  >
                    <option value="">Select members</option>
                    {!loadingUsers &&
                      users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
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
