import gql from 'graphql-tag';

export const GET_SECTION_LIST = gql`
  query {
    getSectionList {
      id
      section
      description
      batchId
      cmsBatchVo {
        id
        batch
        departmentId
        cmsDepartmentVo {
          id
          name
        }
      }
    }
  }
`;
