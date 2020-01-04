import gql from 'graphql-tag';

export const SAVE_AUTHORIZED_SIGNATORY = gql`
  mutation saveAuthorizedSignatory($input: AuthorizedSignatoryInput) {
    saveAuthorizedSignatory(input: $input) {
      cmsAuthorizedSignatoryVo {
        exitCode
        exitDescription
        dataList {
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
    }
  }
`;
