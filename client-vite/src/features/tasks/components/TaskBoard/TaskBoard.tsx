import { useState, useEffect } from "react";
import { TaskColumn } from "../TaskColumn/TaskColumn";
import { TaskCard } from "../TaskCard/TaskCard";
import { DragDropProvider, DragEndEvent, DragOverEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { NewTaskCard } from "../NewTaskCard/NewTaskCard";
import { Task } from "../../types/task.types";
import { TaskModal } from "../TaskModal/TaskModal";
import { createTask, getTasksByProject } from "../../../../api/tasksApi";

// TODO : Move this to types
type Items = Record<string, Task[]>;

const EMPTY_ITEMS: Items = { todo: [], "in-progress": [], done: [] };

const groupByStatus = (tasks: Task[]): Items =>
  tasks.reduce<Items>(
    (acc, task) => {
      acc[task.status] = [...(acc[task.status] ?? []), task];
      return acc;
    },
    { ...EMPTY_ITEMS },
  );

interface TaskBoardProps {
  projectId: string | undefined;
}

export const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const [items, setItems] = useState<Items>(EMPTY_ITEMS);

  const style = {};

  const [columnOrder, setColumnOrder] = useState(() =>
    Object.keys(EMPTY_ITEMS),
  );

  useEffect(() => {
    if (!projectId) return;
    getTasksByProject(projectId).then((tasks) =>
      setItems(groupByStatus(tasks)),
    );
  }, [projectId]);

  const onTaskAdd = async (taskData: Omit<Task, "id" | "createdAt">) => {
    if (projectId) taskData = { ...taskData, project: projectId };
    try {
      const newTask = await createTask(taskData);
      setItems((prev) => ({
        ...prev,
        [newTask.status]: [...prev[newTask.status], newTask],
      }));
      return true;
    } catch {
      return false;
    }
  };

  // TODO : Add Column
  // const [index, setIndex] = useState(0);
  // const addColumn = () => {
  //   const columnName = index;
  //   setIndex((prev) => prev + 1);
  //   let newColumns: Record<string, Task[]>;
  //   setItems((prev) => {
  //     newColumns = { ...prev, [columnName]: [] };
  //     return newColumns;
  //   });
  //   setColumnOrder(() => Object.keys(newColumns));
  //   console.log(items);
  // };

  const onDragOver = (event: DragOverEvent) => {
    const { source } = event.operation;
    // Drag over only if item
    if (source?.type == "column") return;
    setItems((items) => move(items, event));
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { source } = event.operation;
    // Drag end only if not a column
    if (event.canceled || source?.type !== "column") return;

    setColumnOrder((columns) => move(columns, event));
  };

  return (
    <DragDropProvider onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <div className="d-flex flex-row" style={style}>
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
              />
            ))}
            <NewTaskCard />
          </TaskColumn>
        ))}
        {/* <button onClick={addColumn}>Add Column</button> */}
      </div>
      <TaskModal onTaskAdd={onTaskAdd} columns={columnOrder} />
    </DragDropProvider>
  );
};
