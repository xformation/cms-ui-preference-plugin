import gql from 'graphql-tag';

export const SAVE_DEPARTMENT = gql`
  mutation saveDepartment($input: DepartmentInput) {
    saveDepartment(input: $input) {
      cmsDepartmentVo {
        exitCode
        exitDescription
        dataList {
          id
          name
          deptHead
          comments

          createdBy
          updatedBy
          strCreatedOn
          strUpdatedOn
          status
          academicYearId
          cmsAcademicYearVo {
            id
            description
            strStartDate
            strEndDate
          }
          branchId
          cmsBranchVo {
            id
            branchName
          }
        }
      }
    }
  }
`;
