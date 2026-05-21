import { useState, useRef, useEffect } from "react";

// icons
import { FaPlus } from "react-icons/fa";

// styles
import "./NewColumnCard.scss";

interface NewColumnCardProps {
  onAddColumn: (columnName: string) => void;
}

export const NewColumnCard = ({ onAddColumn }: NewColumnCardProps) => {
  const [columnName, setColumnName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(e.target.value);
  };

  const handleAddColumn = () => {
    if (columnName.trim()) {
      onAddColumn(columnName.trim());
      setColumnName("");
      setIsEditing(false);
    }
  };

  const handleIsEditing = () => {
    setColumnName("");
    setIsEditing(true);
  };

  return (
    <div className="card new-column-card d-flex align-items-center justify-content-center">
      {isEditing ? (
        <div className="d-flex flex-column col-12 my-2 px-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Column Name"
            className="form-control form-control-sm "
            value={columnName}
            onChange={handleInputChange}
          />
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={handleAddColumn}
            >
              Add
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="new-column-button col-10 text-center mb-0"
          onClick={handleIsEditing}
        >
          <FaPlus className="me-2" />
          Add Column
        </button>
      )}
    </div>
  );
};
