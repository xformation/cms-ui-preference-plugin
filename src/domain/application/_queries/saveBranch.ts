import gql from 'graphql-tag';

export const SAVE_BRANCH = gql`
  mutation saveBranch($input: BranchInput) {
    saveBranch(input: $input) {
      cmsBranchVo {
        exitCode
        exitDescription
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
        strStartDate
        collegeId
        cityId
        stateId
        createdBy
        updatedBy
        strCreatedOn
        strUpdatedOn
        status
        dataList {
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
          strStartDate
          collegeId
          cityId
          stateId
          createdBy
          updatedBy
          strCreatedOn
          strUpdatedOn
          status
        }
      }
    }
  }
`;
