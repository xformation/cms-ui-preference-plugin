import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const networkInterface = createNetworkInterface({
  uri: 'http://100.81.3.26:9091/graphql'
});
export const gQLClient = new ApolloClient({
  networkInterface: networkInterface
});

