import gql from 'graphql-tag';

export const GET_HOLIDAY_LIST = gql`
  query {
    getHolidayList {
      id
      description
      comments
      strHolidayDate
      createdBy
      updatedBy
      strCreatedOn
      strUpdatedOn
      status
    }
  }
`;
