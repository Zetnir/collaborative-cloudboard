import { useState, useEffect, useRef } from "react";
import { TaskColumn } from "../TaskColumn/TaskColumn";
import { TaskCard } from "../TaskCard/TaskCard";
import {
  DragDropProvider,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { NewTaskCard } from "../NewTaskCard/NewTaskCard";
import { Task } from "../../types/task.types";
import { TaskModal } from "../TaskModal/TaskModal";
import { tasksApi } from "../../api/tasksApi";
import { TaskDetails } from "../TaskDetails/TaskDetails";

// TODO : Move this to types
type Items = Record<string, Task[]>;

const EMPTY_ITEMS: Items = { todo: [], "in-progress": [], done: [] };

const groupByStatus = (tasks: Task[]): Items => {
  const grouped = tasks.reduce<Items>(
    (acc, task) => {
      acc[task.status] = [...(acc[task.status] ?? []), task];
      return acc;
    },
    { ...EMPTY_ITEMS },
  );
  Object.values(grouped).forEach((arr) =>
    arr.sort((a, b) => a.order - b.order),
  );
  return grouped;
};

interface TaskBoardProps {
  projectId: string | undefined;
}

export const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const [items, setItems] = useState<Items>(EMPTY_ITEMS);
  const [columnOrder, setColumnOrder] = useState(() =>
    Object.keys(EMPTY_ITEMS),
  );
  const [currentTask, setCurrentTask] = useState<Task>();

  const itemsRef = useRef(items);
  const dragSourceColumnRef = useRef<string | null>(null);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!projectId) return;
    const fetchTasks = async () => {
      const tasks = await tasksApi.getByProject(projectId);
      setItems(groupByStatus(tasks));
    };
    fetchTasks();
  }, [projectId]);

  const onTaskAdd = async (taskData: Omit<Task, "id" | "createdAt">) => {
    if (projectId) taskData = { ...taskData, project: projectId };
    try {
      const newTask = await tasksApi.create(taskData);
      setItems((prev) => ({
        ...prev,
        [newTask.status]: [...prev[newTask.status], newTask],
      }));
      return true;
    } catch {
      return false;
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    const { source } = event.operation;
    if (source?.type === "column") return;
    const taskId = source?.id as string;
    for (const [status, tasks] of Object.entries(itemsRef.current)) {
      if (tasks.some((t) => t.id === taskId)) {
        dragSourceColumnRef.current = status;
        break;
      }
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { source } = event.operation;
    // Drag over only if item
    if (source?.type === "column") return;
    setItems((items) => move(items, event));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { source } = event.operation;
    if (event.canceled) return;

    if (source?.type === "column") {
      setColumnOrder((columns) => move(columns, event));
      return;
    }

    const taskId = source?.id as string;
    const currentItems = itemsRef.current;
    let targetColumn: string | null = null;
    for (const [status, tasks] of Object.entries(currentItems)) {
      if (tasks.some((t) => t.id === taskId)) {
        targetColumn = status;
        break;
      }
    }
    const affectedColumns = new Set(
      [dragSourceColumnRef.current, targetColumn].filter(Boolean) as string[],
    );
    for (const status of affectedColumns) {
      currentItems[status].forEach((task, order) => {
        tasksApi.move(task.id, { status, order }).catch(console.error);
      });
    }
    dragSourceColumnRef.current = null;
  };

  const onShowCardDetails = (task: Task) => {
    setCurrentTask(task);
  };

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="d-flex flex-row">
        {columnOrder.map((column: string, columnIndex: number) => (
          <TaskColumn
            key={column}
            id={column}
            index={columnIndex}
            title={column}
          >
            {items[column].map((task: Task, index: number) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                column={column}
                onShowCardDetails={onShowCardDetails}
              />
            ))}
            <NewTaskCard />
          </TaskColumn>
        ))}
      </div>
      <TaskModal onTaskAdd={onTaskAdd} columns={columnOrder} />
      <TaskDetails
        task={currentTask as Task}
        onCardUpdate={(updatedTask) => {
          setCurrentTask(updatedTask);
          setItems((prev) => ({
            ...prev,
            [updatedTask.status]: prev[updatedTask.status].map((t) =>
              t.id === updatedTask.id ? updatedTask : t,
            ),
          }));
        }}
      />
    </DragDropProvider>
  );
};
