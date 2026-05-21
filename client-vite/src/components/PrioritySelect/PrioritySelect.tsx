import { useEffect, useRef, useState } from "react";
import TomSelect from "tom-select/base";
import { getPriorityIcon } from "../../utils/priority.utils";

import "./PrioritySelect.scss";

interface PrioritySelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const PrioritySelect = ({ value, onChange }: PrioritySelectProps) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const [currentValue, setCurrentValue] = useState(value || "");

  const onPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentValue(e.target.value);
    onChange?.(e.target.value);
  };

  useEffect(() => {
    if (selectRef.current && !selectRef.current?.tomselect) {
      new TomSelect(selectRef.current, {
        hideSelected: true,
        plugins: ["dropdown_input"],
        render: {
          option(data, escape) {
            return `<div class="d-flex align-items-center">
                ${getPriorityIcon(data.value, true) ?? ""}
                <span>${escape(data.text)}</span>
              </div>`;
          },
          item(data, escape) {
            return `<div class="d-flex align-items-center ">
                ${getPriorityIcon(data.value, true) ?? ""}
                <span>${escape(data.text)}</span>
              </div>`;
          },
        },
      });
    }
  });

  return (
    <div className="priority-select">
      <select
        ref={selectRef}
        id="priority"
        name="priority"
        value={currentValue}
        onChange={onPriorityChange}
        className="form-control"
        autoComplete="off"
      >
        <option value="">Select priority</option>
        <option value="lowest">Lowest</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="highest">Highest</option>
      </select>
    </div>
  );
};
