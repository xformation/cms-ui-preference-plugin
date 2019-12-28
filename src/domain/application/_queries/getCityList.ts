import gql from 'graphql-tag';

export const GET_CITY_LIST = gql`
  query {
    getCityList {
      id
      cityName
      cityCode
      stdCode
      state {
        id
        stateName
        stateCode
        divisionType
      }
    }
  }
`;
