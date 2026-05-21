import {
  FiChevronDown,
  FiChevronsDown,
  FiChevronsUp,
  FiChevronUp,
  FiMinus,
} from "react-icons/fi";

import { renderToStaticMarkup } from "react-dom/server";

import { ReactNode } from "react";

export const priorityIcons: Record<string, ReactNode> = {
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

export const getPriorityIcon = (
  priority: string,
  isStatic: boolean = false,
): ReactNode =>
  isStatic
    ? renderToStaticMarkup(priorityIcons[priority] ?? null)
    : (priorityIcons[priority] ?? null);
