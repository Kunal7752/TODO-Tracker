import Task from "../models/Task.js";
import User from '../models/User.js';

export async function addTask(req, res) {
    const { title, description, dueDate } = req.body;
    if (!title || !description || !dueDate) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newTask = await Task.create({ title, description, dueDate, completed: false, owner: req.user._id });
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { taskList: newTask._id } },
            { new: true }
        );
        res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: error });
    }

}

export async function getTasks(req, res) {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks: tasks
        });
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function patchTask(req, res) {
  const { id } = req.params;
  const { title, description, dueDate, completed } = req.body;

  // at least something must be in the body
  if (
    title === undefined &&
    description === undefined &&
    dueDate === undefined &&
    completed === undefined
  ) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const updates = {};
  if (title !== undefined)       updates.title       = title;
  if (description !== undefined) updates.description = description;
  if (dueDate !== undefined)     updates.dueDate     = dueDate;
  if (completed !== undefined)   updates.completed   = completed;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      updates,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTask(req, res) {
    const { id } = req.params;
    
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
        await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { taskList: req.params.id } }
        );
        if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
