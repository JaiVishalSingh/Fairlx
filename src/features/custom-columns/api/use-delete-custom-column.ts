import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { useBulkUpdateTasks } from "@/features/tasks/api/use-bulk-update-tasks";
import { TaskStatus } from "@/features/tasks/types";

type ResponseType = InferResponseType<typeof client.api["custom-columns"][":customColumnId"]["$delete"]>;
type RequestType = InferRequestType<typeof client.api["custom-columns"][":customColumnId"]["$delete"]>;

interface UseDeleteCustomColumnProps {
  onTasksMoved?: () => void;
}

export const useDeleteCustomColumn = (props?: UseDeleteCustomColumnProps) => {
  const queryClient = useQueryClient();
  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  const mutation = useMutation<ResponseType, Error, RequestType & { moveTasks?: boolean }>({
    mutationFn: async ({ param, moveTasks = true }) => {
      // First, if moveTasks is true, move all tasks from this column to ASSIGNED
      if (moveTasks) {
        // Get all tasks data from the cache
        const workspaceTasks = queryClient.getQueriesData({ 
          queryKey: ["tasks"] 
        });
        
        // Find tasks in the column being deleted
        const tasksToMove: string[] = [];
        workspaceTasks.forEach(([, data]: [unknown, unknown]) => {
          if (data && typeof data === 'object' && 'documents' in data) {
            const documents = (data as { documents: unknown[] }).documents;
            documents.forEach((task: unknown) => {
              if (task && typeof task === 'object' && '$id' in task && 'status' in task) {
                const taskObj = task as { $id: string; status: string };
                if (taskObj.status === param.customColumnId) {
                  tasksToMove.push(taskObj.$id);
                }
              }
            });
          }
        });

        // Move tasks to TODO
        if (tasksToMove.length > 0) {
          const updates = tasksToMove.map(taskId => ({
            $id: taskId,
            status: TaskStatus.TODO,
          }));

          try {
            await new Promise((resolve, reject) => {
              bulkUpdateTasks(
                { json: { tasks: updates } },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
          } catch {
            // Silent fail for task move
          }
        }
      }

      // Then delete the custom column
      const response = await client.api["custom-columns"][":customColumnId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete custom column");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Custom column deleted");
      queryClient.invalidateQueries({ queryKey: ["custom-columns"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Also invalidate workflow queries to reflect status deletion in workflow view
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow"] });
      queryClient.invalidateQueries({ queryKey: ["workflow-statuses"] });
      props?.onTasksMoved?.();
    },
    onError: () => {
      toast.error("Failed to delete custom column");
    },
  });

  return mutation;
};
