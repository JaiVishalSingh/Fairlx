import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workflows)[":workflowId"]["statuses"][":statusId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workflows)[":workflowId"]["statuses"][":statusId"]["$patch"]
>;

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workflows[":workflowId"]["statuses"][":statusId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error((error as { error?: string }).error || "Failed to update status");
      }

      return await response.json();
    },
    onSuccess: (data, { param }) => {
      // If status was deleted during sync, just invalidate without success toast
      if ((data as { deleted?: boolean }).deleted) {
        queryClient.invalidateQueries({ queryKey: ["workflow", param.workflowId] });
        queryClient.invalidateQueries({ queryKey: ["workflow-statuses", param.workflowId] });
        return;
      }
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workflow", param.workflowId] });
      queryClient.invalidateQueries({ queryKey: ["workflow-statuses", param.workflowId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  return mutation;
};
