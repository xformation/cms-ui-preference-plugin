import gql from 'graphql-tag';

export const GET_FACILITY_LIST = gql`
  query {
    getFacilityList {
      id
      name
      status
      strStartDate
      strEndDate
      strSuspandStartDate
      strSuspandEndDate
      amount
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
