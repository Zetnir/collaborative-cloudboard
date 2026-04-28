import { useState } from "react";
import { TaskColumn } from "../TaskColumn/TaskColumn";
import { TaskCard } from "../TaskCard/TaskCard";
import { DragDropProvider, DragEndEvent, DragOverEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { NewTaskCard } from "../NewTaskCard/NewTaskCard";
import { Task } from "../../types/task.types";
import { TaskModal } from "../TaskModal/TaskModal";

const defaultTasks: Task[] = [
  {
    id: "111111",
    title: "Task 1",
    description: "desc task 1",
    status: "todo",
    project: "12345",
    assignee: "54321",
    order: 1,
    createdAt: new Date(),
  },
  {
    id: "2222222",
    title: "Task 2",
    description: "desc task 2",
    status: "todo",
    project: "12345",
    assignee: "54321",
    order: 2,
    createdAt: new Date(),
  },
  {
    id: "3333333",
    title: "Task 3",
    description: "desc task 3",
    status: "todo",
    project: "12345",
    assignee: "54321",
    order: 3,
    createdAt: new Date(),
  },
];

const defaultItems = {
  todo: [defaultTasks[0], defaultTasks[2]],
  "in-progress": [defaultTasks[1]],
  done: [],
};

// TODO : Move this to types
type Items = Record<string, Task[]>;

interface TaskBoardProps {
  projectId: string | undefined;
}

export const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const [items, setItems] = useState<Items>(defaultItems);

  const style = {};

  const [columnOrder, setColumnOrder] = useState(() => Object.keys(items));

  const onTaskAdd = async (taskData: Omit<Task, "id" | "createdAt">) => {
    if (projectId) taskData = { ...taskData, project: projectId };
    console.log(taskData);
    return false;
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
                title={task.title}
                description={task.description}
                key={task.id}
                id={task.id}
                index={index}
                column={column}
              />
            ))}
            <NewTaskCard />
          </TaskColumn>
        ))}
        {/* <button onClick={addColumn}>Add Column</button> */}
      </div>
      <TaskModal onTaskAdd={onTaskAdd} />
    </DragDropProvider>
  );
};
