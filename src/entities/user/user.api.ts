import { graphqlClient } from '../../shared/api/graphqlClient';
import type { User } from './user.types';
const GET_USERS = `
  query GetAllUsers {
    users {
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