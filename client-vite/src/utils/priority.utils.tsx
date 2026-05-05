import {
  FiChevronDown,
  FiChevronsDown,
  FiChevronsUp,
  FiChevronUp,
  FiMinus,
} from "react-icons/fi";

import { ReactNode } from "react";

const priorityIcons: Record<string, ReactNode> = {
  highest: (
    <FiChevronsUp color="var(--color-danger)" size={18} strokeWidth={3} />
  ),
  high: <FiChevronUp color="var(--color-danger)" size={18} strokeWidth={3} />,
  medium: <FiMinus color="var(--color-secondary)" size={18} strokeWidth={3} />,
  low: <FiChevronDown color="var(--color-primary)" size={18} strokeWidth={3} />,
  lowest: (
    <FiChevronsDown color="var(--color-primary)" size={18} strokeWidth={3} />
  ),
};

export const getPriorityIcon = (priority: string): ReactNode =>
  priorityIcons[priority] ?? null;
