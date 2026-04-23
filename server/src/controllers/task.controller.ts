import { Request, Response } from "express";
import { Task } from "../models/Task.js";

interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  project: string;
  assignee?: string;
  order: number;
  createdAt: Date;
}

const taskToDto = (task: any): TaskDTO => {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    project: task.project.toString(),
    assignee: task.assignee ? task.assignee.toString() : undefined,
    order: task.order,
    createdAt: task.createdAt,
  };
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks.map(taskToDto));
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch tasks",
      error,
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(taskToDto(task));
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch task",
      error,
    });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    return res.status(201).json(taskToDto(savedTask));
  } catch (error) {
    return res.status(400).json({
      message: "Unable to create task",
      error,
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(taskToDto(updatedTask));
  } catch (error) {
    return res.status(400).json({
      message: "Unable to update task",
      error,
    });
  }
};

export const moveTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { order, status },
      { new: true, runValidators: true },
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json(taskToDto(updatedTask));
  } catch (error) {
    return res.status(400).json({
      message: "Unable to move task",
      error,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      data: taskToDto(deletedTask),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete task",
      error,
    });
  }
};
