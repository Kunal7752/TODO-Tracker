import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { isPending, isSuccess, error, signupMutation: mutate };
};
export default useSignUp;
