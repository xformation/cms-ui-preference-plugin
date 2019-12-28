import gql from 'graphql-tag';

export const ADD_COLLEGE = gql`
  mutation AddCollege($input: CollegeInput) {
    addCollege(input: $input) {
      cmsCollegeVo {
        id
        collegeName
        logoFilePath
        logoFileName
        logoFileExtension
        logoFile
        createdBy
        updatedBy
        status
        strCreatedOn
        strUpdatedOn
        exitCode
        exitDescription
      }
    }
  }
`;
