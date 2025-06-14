import { GraphQLClient } from "graphql-request";

const HASURA_ENDPOINT = "http://localhost:8080/v1/graphql";
const HASURA_ADMIN_SECRET = "mysupersecretkey";

export const graphqlClient = new GraphQLClient(HASURA_ENDPOINT, {
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
});
