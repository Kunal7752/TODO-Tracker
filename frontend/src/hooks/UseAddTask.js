import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../lib/api";

const useAddTask = () => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isPending, error } = useMutation({
    mutationFn: addTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { error, isSuccess, isPending, addTaskMutation: mutate };
};

export default useAddTask;