import gql from 'graphql-tag';

export const GET_BRANCH_LIST = gql`
  query {
    getBranchList {
      id
      branchName
      address
      pinCode
      branchHead
      cellPhoneNo
      landLinePhoneNo
      emailId
      faxNo
      isMainBranch
      startDate
      college {
        id
        collegeName
      }
      city {
        id
        cityName
        stdCode
      }
      state {
        id
        stateName
        country {
          id
          countryName
          countryCode
        }
      }
      strStartDate
      collegeId
      cityId
      stateId
      createdBy
      createdOn
      updatedBy
      updatedOn
      strCreatedOn
      strUpdatedOn
      exitCode
      exitDescription
      status
    }
  }
`;
