import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Label } from "../../types";
import { gql } from "@apollo/client";
import { client } from "../../lib/apollo";

interface LabelsState {
  items: Label[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LabelsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchLabels = createAsyncThunk(
  'labels/fetchLabels',
  async () => {
    const { data } = await client.query({
      query: gql`
        query GetLabels {
          labels(order_by: { id: asc }) {
            id
            caption
            color
            task_labels {
              task {
                id
                title
                description
              }
            }
          }
        }
      `,
    });
    return data.labels;
  }
);

const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLabels.fulfilled, (state, action: PayloadAction<Label[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchLabels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка при загрузке меток';
      });
  },
});

export default labelsSlice.reducer; 