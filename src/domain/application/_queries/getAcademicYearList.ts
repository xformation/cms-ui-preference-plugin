import gql from 'graphql-tag';

export const GET_ACADEMIC_YEAR_LIST = gql`
  query {
    getAcademicYearList {
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
    }
  }
`;
