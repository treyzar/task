import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql";
import type { User } from "../types";

interface UpdateUserResponse {
  update_users_by_pk: User;
}

const GET_USERS = `
  query GetUsers {
    users(order_by: { id: asc }) {
      id
      first_name
      last_name
      bio
      tasks {
        id
        title
      }
    }
  }
`;

const CREATE_USER = `
  mutation CreateUser($first_name: String!, $last_name: String!, $bio: String) {
    insert_users_one(object: {
      first_name: $first_name,
      last_name: $last_name,
      bio: $bio
    }) {
      id
      first_name
      last_name
      bio
    }
  }
`;

const UPDATE_USER = `
  mutation UpdateUser($id: Int!, $first_name: String!, $last_name: String!, $bio: String) {
    update_users_by_pk(
      pk_columns: { id: $id },
      _set: {
        first_name: $first_name,
        last_name: $last_name,
        bio: $bio
      }
    ) {
      id
      first_name
      last_name
      bio
    }
  }
`;

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { users } = await graphqlClient.request(GET_USERS);
      return users;
    },
  });

  const createUser = useMutation({
    mutationFn: async (newUser: Omit<User, "id">) => {
      const { insert_users_one } = await graphqlClient.request(
        CREATE_USER,
        newUser
      );
      return insert_users_one;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = useMutation({
    mutationFn: async (payload: { id: number } & Omit<User, "id" | "tasks">) => {
      const { id, ...data } = payload;
      const { update_users_by_pk } = await graphqlClient.request<UpdateUserResponse>(
        UPDATE_USER,
        {
          id,
          ...data,
        }
      );
      return update_users_by_pk;
    },
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      if (previousUsers) {
        queryClient.setQueryData<User[]>(["users"], (old) => {
          if (!old) return old;
          return old.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
        });
      }
      return { previousUsers };
    },
    onError: (_err, _newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users,
    isLoading,
    error,
    createUser: createUser.mutate,
    updateUser: updateUser.mutate,
  };
}
