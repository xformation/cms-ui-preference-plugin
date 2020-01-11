import gql from 'graphql-tag';

export const GET_TERM_LIST = gql`
  query {
    getTermList {
      id
      description
      comments
      strStartDate
      strEndDate
      createdBy
      updatedBy
      strCreatedOn
      strUpdatedOn
      status
      academicYearId
      cmsAcademicYearVo {
        id
        description
        strStartDate
        strEndDate
      }
    }
  }
`;
