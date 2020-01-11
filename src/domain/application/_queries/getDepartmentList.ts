import gql from 'graphql-tag';

export const GET_DEPARTMENT_LIST = gql`
  query {
    getDepartmentList {
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
`;
