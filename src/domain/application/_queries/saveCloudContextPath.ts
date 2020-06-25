import gql from 'graphql-tag';

export const SAVE_CLOUD_CONTEXT_PATH = gql`
  mutation saveCloudContextPath($input: CloudContextPathInput) {
    saveCloudContextPath(input: $input) {
      cmsCloudContextPathVo {
        exitCode
        exitDescription
        dataList {
          id
          plugin
          path
        }
      }
    }
  }
`;
