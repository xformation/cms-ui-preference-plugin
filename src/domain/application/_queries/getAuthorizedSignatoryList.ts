import gql from 'graphql-tag';

export const GET_AUTHORIZED_SIGNATORY_LIST = gql`
  query {
    getAuthorizedSignatoryList {
      id
      name
      fatherName
      designation
      address
      emailId
      cellPhoneNumber
      panNo
      createdBy
      updatedBy
      strCreatedOn
      strUpdatedOn
      status
      branchId
      cmsBranchVo {
        id
        branchName
        address
      }
    }
  }
`;
