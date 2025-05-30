const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL;
const ADMIN_SECRET = import.meta.env.VITE_HASURA_ADMIN_SECRET || "";

export const graphqlClient = async <T>(options: {
  query: string;
  variables?: Record<string, any>;
}): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ADMIN_SECRET) {
    headers["x-hasura-admin-secret"] = ADMIN_SECRET;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: options.query,
      variables: options.variables || {},
    }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
};
