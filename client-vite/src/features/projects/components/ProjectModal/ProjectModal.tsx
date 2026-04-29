import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react";

// api
import { usersApi } from "../../../../api/usersApi";

// components
import { ImageDropzone } from "../../../../components/ImageDropzone/ImageDropzone";

// types
import { User } from "../../../auth/types/auth.types";
import { Project } from "../../types/project.types";

// utils
import TomSelect from "tom-select";
import { toast } from "react-toastify";
import { useAuth } from "../../../auth/hooks/AuthContext";

// styles
import "./ProjectModal.scss";
import "tom-select/dist/css/tom-select.css";

interface ProjectFormData {
  name: string;
  description: string;
  members: string[];
  access: "private" | "public";
  workspace: string;
  coverImg: File | null;
}

interface ProjectModalProps {
  onProjectAdd: (
    projectData: Omit<Project, "id" | "createdAt">,
  ) => Promise<boolean>;
}

export const ProjectModal = (props: ProjectModalProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    members: [],
    access: "private",
    workspace: "personal",
    coverImg: null,
  });

  const { user } = useAuth();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [users, setUsers] = useState<User[] | null>(null);

  const selectRef = useRef<HTMLSelectElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value,
      );
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectData = formatProjectData(formData);
    try {
      const creationSucceed = await props.onProjectAdd(projectData);
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

  const formatProjectData = (data: ProjectFormData) => {
    return {
      name: data.name || "Untitled Board",
      description: data.description || "",
      owner: user?.id || "",
      members: data.members || [],
      access: data.access,
      workspace: data.workspace,
      coverImg: data.coverImg,
    } as Omit<Project, "id" | "createdAt">;
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
      name: "",
      description: "",
      members: [],
      access: "private",
      workspace: "personal",
      coverImg: null,
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
      role="dialog"
      tabIndex={-1}
      ref={modalRef}
      aria-labelledby="exampleModalLabel"
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
                id="closeModalButton"
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
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    required
                    rows={3}
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
                <div className="d-flex flex-row gap-4">
                  <div className="col mb-3">
                    <label htmlFor="access" className="form-label">
                      Access
                    </label>
                    <select
                      id="access"
                      name="access"
                      value={formData.access}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <div className="col mb-3">
                    <label htmlFor="workspace" className="form-label">
                      Workspace
                    </label>
                    <select
                      id="workspace"
                      name="workspace"
                      value={formData.workspace}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="personal">Personal</option>
                      <option value="Ti-banjo">Ti-banjo</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Cover Image</label>
                  <ImageDropzone
                    value={formData.coverImg}
                    onChange={(file) =>
                      setFormData((prev) => ({ ...prev, coverImg: file }))
                    }
                  />
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
