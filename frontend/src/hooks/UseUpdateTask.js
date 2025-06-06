// src/hooks/useUpdateTask.js
import { patchTask } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateTask = () => { 
  const queryClient = useQueryClient();

  const { mutate, isLoading, isSuccess, error } = useMutation({
    // Expect an object { id, data } here
    mutationFn: ({ id, data }) => patchTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    updateTaskMutation: mutate,
    isUpdating: isLoading,
    isUpdateSuccess: isSuccess,
    updateError: error,
  };
};

export default useUpdateTask;
