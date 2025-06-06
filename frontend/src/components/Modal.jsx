// src/components/Modal.jsx
import React from "react";

export default function Modal({
  dialogId,
  onSubmit,
  newTask,
  handleChange,
  isLoading,
  error,
  isUpdateMode,
}) {
  const options = ["Yes", "No"];

  const handleCompletedClick = (opt) =>
    handleChange({ target: { name: "completed", value: opt === "Yes" } });

  return (
    <dialog id={dialogId} className="modal">
      <div className="modal-box w-11/12 max-w-lg">
        <h3 className="font-bold text-lg mb-4">
          {isUpdateMode ? "Edit Task" : "New Task"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={newTask.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter task title"
              required
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={newTask.description}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter description"
              required
              disabled={isLoading}
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={newTask.dueDate}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>

          {/* Completed? (only in edit mode) */}
          {isUpdateMode && (
            <div>
              <label
                htmlFor="completed"
                className="block text-sm font-medium mb-1"
              >
                Completed?
              </label>
              <div className="dropdown dropdown-bottom">
                <div tabIndex={0} className="btn m-1">
                  {newTask.completed ? "Yes" : "No"} ⬇️
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                  {options.map((opt, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => handleCompletedClick(opt)}
                      >
                        {opt}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm">
              {error.message || "Something went wrong"}
            </p>
          )}

          <div className="modal-action flex justify-end space-x-2">
            <button
              type="button"
              className="btn"
              onClick={() => document.getElementById(dialogId).close()}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-success ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading
                ? isUpdateMode
                  ? "Updating…"
                  : "Saving…"
                : isUpdateMode
                ? "Update Task"
                : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
