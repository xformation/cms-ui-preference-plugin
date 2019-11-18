import gql from 'graphql-tag';

export const ADD_COLLEGE = gql`
  mutation AddCollege($input: CollegeInput) {
    addCollege(input: $input) {
      cmsCollegeVo {
        collegeName
        logoFile
      }
    }
  }
`;
