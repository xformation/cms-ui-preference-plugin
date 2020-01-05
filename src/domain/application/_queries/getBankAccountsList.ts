import gql from 'graphql-tag';

export const GET_BANK_ACCOUNTS_LIST = gql`
  query {
    getBankAccountsList {
      id
      bankName
      accountNumber
      typeOfAccount
      ifscCode
      address
      corporateId
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
