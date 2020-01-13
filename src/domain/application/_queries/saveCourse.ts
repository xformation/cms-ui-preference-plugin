import gql from 'graphql-tag';

export const SAVE_COURSE = gql`
  mutation saveCourse($input: CourseInput) {
    saveCourse(input: $input) {
      cmsCourseVo {
        exitCode
        exitDescription
        dataList {
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
    }
  }
`;
