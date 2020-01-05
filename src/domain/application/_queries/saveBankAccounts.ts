import gql from 'graphql-tag';

export const SAVE_BANK_ACCOUNTS = gql`
  mutation saveBankAccounts($input: BankAccountsInput) {
    saveBankAccounts(input: $input) {
      cmsBankAccountsVo {
        exitCode
        exitDescription
        dataList {
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
    }
  }
`;
