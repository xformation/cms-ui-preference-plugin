import gql from 'graphql-tag';

export const GET_COURSE_LIST = gql`
  query {
    getCourseList {
      id
      name
      description
      courseDuration
      courseType
      yearOrSemesterType
      totalFee
      yearlyFee
      perSemesterFee
      comments

      createdBy
      updatedBy
      strCreatedOn
      strUpdatedOn
      status
      departmentId
      cmsDepartmentVo {
        id
        name
        cmsBranchVo {
          id
          branchName
        }
      }
      branchId
      cmsBranchVo {
        id
        branchName
      }
    }
  }
`;
