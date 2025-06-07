import { graphqlClient } from '../../shared/api/graphqlClient';
import type { User } from './user.types';

const GET_USERS = `
  query GetAllUsers {
    users(order_by: [{id: asc}]) {
      id
      first_name
      last_name
      bio
    }
  }
`;

const GET_USER_BY_ID = `
  query GetUserById($id: Int!) {
    users_by_pk(id: $id) {
      id
      first_name
      last_name
      bio
    }
  }
`;

export const getUsers = async (): Promise<User[]> => {
  const result = await graphqlClient<{ users: User[] }>({
    query: GET_USERS,
  });

  return result.users;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await graphqlClient<{
    users_by_pk: User | null;
  }>({
    query: GET_USER_BY_ID,
    variables: { id },
  });

  return result.users_by_pk;
};