import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../lib/api";

const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate "tasks" so the list refetches
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useDeleteTask;
