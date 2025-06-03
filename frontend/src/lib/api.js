import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};
export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
export const getTasks = async () => {
  const response = await axiosInstance.get("/tasks/getTasks");
  return response.data;
}
export const addTask = async (taskData) => {
  const response = await axiosInstance.post("/tasks/addTask", taskData);
  return response.data;
};
export const patchTask = async (taskId, taskData) => {
  const response = await axiosInstance.patch(`/tasks/patchTask/${taskId}`, taskData);
  return response.data;
};
export const deleteTask = async (taskId) => {
  const response = await axiosInstance.delete(`/tasks/deleteTask/${taskId}`);
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};