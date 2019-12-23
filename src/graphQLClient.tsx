import { ApolloClient, createNetworkInterface } from 'react-apollo';

const networkInterface = createNetworkInterface({
  // uri: 'http://100.81.3.25:8080/graphql'
  uri: 'http://localhost:9091/graphql'
});
export const gQLClient = new ApolloClient({
  networkInterface: networkInterface
});