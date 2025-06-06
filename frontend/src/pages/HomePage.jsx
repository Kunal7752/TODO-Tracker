// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useLogout from "../hooks/UseLogout";
import useAddTask from "../hooks/UseAddTask";
import useUpdateTask from "../hooks/UseUpdateTask";
import useDeleteTask from "../hooks/UseDeleteTask";
import { axiosInstance } from "../lib/axios";

import Modal from "../components/Modal";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";

const fetchTasks = async () => {
  const { data } = await axiosInstance.get("/tasks/getTasks");
  return data.tasks;
};

export default function HomePage() {
  const dialogId = "task_modal";

  // Auth
  const { logoutMutation, isPending: isLoggingOut } = useLogout();

  // Tasks Query
  const {
    data: fetchedTasks = [],
    isLoading: isFetching,
    isError: fetchError,
    error: fetchErrorObj,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  // Modal / Form State
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });

  // Mutations
  const {
    addTaskMutation,
    isPending: isAdding,
    error: addError,
  } = useAddTask();

  const {
    updateTaskMutation,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateTask();

  const { mutate: deleteTask, isLoading: isDeleting } = useDeleteTask();

  // Handlers
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
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    addTaskMutation(newTask, {
      onSuccess: () => {
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
          completed: false,
        });
        document.getElementById(dialogId).close();
      },
    });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    updateTaskMutation(
      { id: currentTask._id, data: newTask },
      {
        onSuccess: () => {
          setIsUpdateMode(false);
          setCurrentTask(null);
          setNewTask({
            title: "",
            description: "",
            dueDate: "",
            completed: false,
          });
          document.getElementById(dialogId).close();
        },
      }
    );
  };

  const onEdit = (task) => {
    setCurrentTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed,
    });
    setIsUpdateMode(true);
    document.getElementById(dialogId).showModal();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Logout */}
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar w-full">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-6 w-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="mx-2 flex-1 px-2 font-bold text-lg">TaskMate</div>
            <div className="hidden flex-none lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li>
                  <a>Navbar Item 1</a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging out…" : "Logout"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <Modal
            dialogId={dialogId}
            onSubmit={isUpdateMode ? handleUpdateTask : handleAddTask}
            newTask={newTask}
            handleChange={handleChange}
            isLoading={isAdding || isUpdating}
            error={isUpdateMode ? updateError : addError}
            isUpdateMode={isUpdateMode}
          />

          {/* Tasks Table */}
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
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center italic text-gray-500"
                    >
                      Loading tasks…
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan={6} className="text-center text-red-600">
                      Error fetching tasks: {fetchErrorObj.message}
                    </td>
                  </tr>
                ) : fetchedTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center italic text-gray-500"
                    >
                      Task Table is empty
                    </td>
                  </tr>
                ) : (
                  fetchedTasks.map((task, idx) => (
                    <tr key={task._id} className="bg-base-200">
                      <th>{idx + 1}</th>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>
                        {task.completed ? (
                          <span className="text-green-600 font-medium">
                            Yes
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">No</span>
                        )}
                      </td>
                      <td>{task.dueDate}</td>
                      <td className="space-x-2">
                        <EditButton onClick={() => onEdit(task)} />
                        <DeleteButton
                          onClick={() => deleteTask(task._id)}
                          disabled={isDeleting}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={6} className="text-right pr-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setIsUpdateMode(false);
                        setNewTask({
                          title: "",
                          description: "",
                          dueDate: "",
                          completed: false,
                        });
                        document.getElementById(dialogId).showModal();
                      }}
                    >
                      Add New Task
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
