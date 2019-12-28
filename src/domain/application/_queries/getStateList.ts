import gql from 'graphql-tag';

export const GET_STATE_LIST = gql`
  query {
    getStateList {
      id
      stateName
      stateCode
      divisionType
      country {
        id
        countryName
        countryCode
      }
    }
  }
`;
