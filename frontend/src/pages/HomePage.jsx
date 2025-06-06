// HomePage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useLogout from "../hooks/UseLogout";
import useAddTask from "../hooks/UseAddTask";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import useDeleteTask from "../hooks/UseDeleteTask";

import { axiosInstance } from "../lib/axios";

const fetchTasks = async () => {
  const response = await axiosInstance.get("/tasks/getTasks");
  return response.data.tasks;
};

const HomePage = () => {
  const { logoutMutation, isPending: isLoggingOut } = useLogout();

  const {
    data: fetchedTasks = [],
    isLoading: isFetching,
    isError: fetchError,
    error: fetchErrorObj,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Input state for the “Add Task” form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // ID of the <dialog>
  const dialogId = "task_modal";

  // 3) Destructure exactly what the hook returns (including the mutation function)
  const {
    addTaskMutation,
    isPending: isAdding,
    error: addError,
  } = useAddTask();

  const handleLogout = (e) => {
    e.preventDefault();
    logoutMutation();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!newTask.title.trim() || !newTask.description.trim()) {
      return;
    }

    // 4) Call the mutation. On success, invalidate the ["tasks"] query so it refetches.
    addTaskMutation(newTask, {
      onSuccess: (createdTaskFromServer) => {
        // Invalidate the "tasks" query so React Query will re-run fetchTasks()
        // (internally, useAddTask’s onSuccess should already do this;
        //  if it only invalidates ["authUser"], you can explicitly invalidate ["tasks"] here:
        // queryClient.invalidateQueries({ queryKey: ["tasks"] });

        // Reset the form ITSELF (we still want to close the modal after the server returns)
        setNewTask({ title: "", description: "", dueDate: "" });
        document.getElementById(dialogId).close();
      },
      onError: (err) => {
        console.error("Add Task failed:", err);
      },
    });
  };

  const { mutate: deleteMutate, isLoading: isDeleting } = useDeleteTask();

  // const handleDelete = () => {
  //   deleteMutate(task.id);
  // };

  return (
    <div className="p-4 space-y-6">
      {/* === LOGOUT BUTTON === */}
      <div className="border-b-2 border-gray-300">
        <div className="flex justify-end w-full p-4">
          <button
            className="btn-md bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>

      {/* === ADD TASK MODAL DIALOG === */}
      <dialog id={dialogId} className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg mb-4">New Task</h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter task title"
                required
                disabled={isAdding}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter description"
                required
                disabled={isAdding}
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleChange}
                className="input input-bordered w-full"
                disabled={isAdding}
              />
            </div>

            {addError && (
              <p className="text-red-600 text-sm">
                {addError.message || "Error adding task"}
              </p>
            )}

            <div className="modal-action flex justify-end space-x-2">
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById(dialogId).close()}
                disabled={isAdding}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-success ${
                  isAdding ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isAdding}
              >
                {isAdding ? "Saving…" : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* === TASK TABLE === */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              // 5) Show a loading indicator while the GET request is in flight
              <tr>
                <td colSpan={5} className="text-center italic text-gray-500">
                  Loading tasks…
                </td>
              </tr>
            ) : fetchError ? (
              // 6) Show an error row if fetching failed
              <tr>
                <td colSpan={5} className="text-center text-red-600">
                  Error fetching tasks: {fetchErrorObj.message}
                </td>
              </tr>
            ) : fetchedTasks.length === 0 ? (
              // 7) If the GET succeeded but returned an empty array
              <tr>
                <td colSpan={5} className="text-center italic text-gray-500">
                  Task Table is empty
                </td>
              </tr>
            ) : (
              // 8) Otherwise, map over fetchedTasks
              fetchedTasks.map((task) => (
                <tr key={task.id} className="bg-base-200">
                  <th>{task.id}</th>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {task.completed ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td>{task.dueDate}</td>
                  <td>
                    <EditButton onClick={() => onEdit(task)} />
                    <DeleteButton
                      onClick={() => deleteMutate(task._id)}
                      disabled={isDeleting}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={5} className="text-right pr-4">
                <button
                  className="btn btn-primary"
                  onClick={() => document.getElementById(dialogId).showModal()}
                >
                  Add New Task
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
