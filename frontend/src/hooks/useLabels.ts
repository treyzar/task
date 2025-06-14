import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql";
import type { Label } from "../types";

const GET_LABELS = `
  query GetLabels {
    labels(order_by: { id: asc }) {
      id
      caption
      color
      task_labels {
        task {
          id
          title
        }
      }
    }
  }
`;

const CREATE_LABEL = `
  mutation CreateLabel($caption: String!, $color: String!) {
    insert_labels_one(object: {
      caption: $caption,
      color: $color
    }) {
      id
      caption
      color
    }
  }
`;

const UPDATE_LABEL = `
  mutation UpdateLabel($id: Int!, $caption: String!, $color: String!) {
    update_labels_by_pk(
      pk_columns: { id: $id },
      _set: {
        caption: $caption,
        color: $color
      }
    ) {
      id
      caption
      color
    }
  }
`;

interface UpdateLabelResponse {
  update_labels_by_pk: Label;
}

export function useLabels() {
  const queryClient = useQueryClient();

  const {
    data: labels,
    isLoading,
    error,
  } = useQuery<Label[]>({
    queryKey: ["labels"],
    queryFn: async () => {
      const { labels } = await graphqlClient.request(GET_LABELS);
      return labels.map((label: any) => ({
        ...label,
        tasks: label.task_labels.map((tl: any) => tl.task),
      }));
    },
  });

  const createLabel = useMutation({
    mutationFn: async (newLabel: Omit<Label, "id" | "tasks">) => {
      const { insert_labels_one } = await graphqlClient.request(
        CREATE_LABEL,
        newLabel
      );
      return insert_labels_one;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });

  const updateLabel = useMutation({
    mutationFn: async (payload: { id: number } & Omit<Label, 'id' | 'tasks'>) => {
      const { id, ...data } = payload;
      const { update_labels_by_pk } = await graphqlClient.request<UpdateLabelResponse>(
        UPDATE_LABEL,
        { id, ...data }
      );
      return update_labels_by_pk;
    },
    onMutate: async (updatedLabel) => {
      await queryClient.cancelQueries({ queryKey: ["labels"] });
      const previousLabels = queryClient.getQueryData<Label[]>(["labels"]);
      if (previousLabels) {
        queryClient.setQueryData<Label[]>(["labels"], (old) => {
          if (!old) return old;
          return old.map((l) => (l.id === updatedLabel.id ? { ...l, ...updatedLabel } : l));
        });
      }
      return { previousLabels };
    },
    onError: (_err, _newLabel, context) => {
      if (context?.previousLabels) {
        queryClient.setQueryData(["labels"], context.previousLabels);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });

  return {
    labels,
    isLoading,
    error,
    createLabel: createLabel.mutate,
    updateLabel: updateLabel.mutate,
  };
}
