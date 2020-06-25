import gql from 'graphql-tag';

export const GET_CLOUD_CONTEXT_PATH_LIST = gql`
  query {
    getCloudContextPathList {
      id
      plugin
      path
    }
  }
`;
