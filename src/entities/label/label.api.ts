import { graphqlClient } from "../../shared/api/graphqlClient";
import type { Label } from "./label.types";

const GET_LABELS = `
  query GetAllLabels {
    labels {
      id
      caption
      color
    }
  }
`;

const CREATE_LABEL_MUTATION = `
  mutation CreateLabel($caption: String!, $color: String!) {
    insert_labels_one(object: { caption: $caption, color: $color }) {
      id
    }
  }
`;

const UPDATE_LABEL_MUTATION = `
  mutation UpdateLabel($id: Int!, $caption: String!, $color: String!) {
    update_labels_by_pk(
      pk_columns: { id: $id },
      _set: { caption: $caption, color: $color }
    ) {
      id
    }
  }
`;

export const getLabels = async (): Promise<Label[]> => {
  const result = await graphqlClient<{ labels: Label[] }>({
    query: GET_LABELS,
  });

  return result.labels;
};

export const createLabel = async (
  caption: string,
  color: string
): Promise<void> => {
  await graphqlClient({
    query: CREATE_LABEL_MUTATION,
    variables: { caption, color },
  });
};

export const updateLabel = async (
  labelId: number,
  caption: string,
  color: string
): Promise<void> => {
  await graphqlClient({
    query: UPDATE_LABEL_MUTATION,
    variables: { id: labelId, caption, color },
  });
};
