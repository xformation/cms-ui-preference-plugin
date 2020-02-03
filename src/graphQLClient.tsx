import { ApolloClient, createNetworkInterface } from 'react-apollo';
import {config} from './domain/application/config';

const networkInterface = createNetworkInterface({
  // uri: 'http://100.81.3.25:8080/graphql'
  uri: config.GRAPHQL_URL
});
export const gQLClient = new ApolloClient({
  networkInterface: networkInterface
});