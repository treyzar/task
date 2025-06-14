import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";
import { gql } from "@apollo/client";
import { client } from "../../lib/apollo";
interface UsersState {
  items: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const { data } = await client.query({
      query: gql`
        query GetUsers {
          users(order_by: { id: asc }) {
            id
            first_name
            last_name
            tasks {
              id
              title
              description
              created_at
            }
          }
        }
      `,
    });
    return data.users;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка при загрузке пользователей';
      });
  },
});

export default usersSlice.reducer; 