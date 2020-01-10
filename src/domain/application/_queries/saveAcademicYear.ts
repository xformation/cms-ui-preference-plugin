import gql from 'graphql-tag';

export const SAVE_ACADEMIC_YEAR = gql`
  mutation saveAcademicYear($input: AcademicYearInput) {
    saveAcademicYear(input: $input) {
      cmsAcademicYearVo {
        exitCode
        exitDescription
        dataList {
          id
          description
          comments
          strStartDate
          strEndDate
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
