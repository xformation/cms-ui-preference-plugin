import gql from 'graphql-tag';

export const SAVE_FACILITY = gql`
  mutation saveFacility($input: FacilityInput) {
    saveFacility(input: $input) {
      cmsFacility {
        exitCode
        exitDescription
        dataList {
          id
          name
          amount
          strStartDate
          strEndDate
          strSuspandStartDate
          strSuspandEndDate
          academicYearId
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
