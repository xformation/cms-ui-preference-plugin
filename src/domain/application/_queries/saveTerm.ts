import gql from 'graphql-tag';

export const SAVE_TERM = gql`
  mutation saveTerm($input: TermInput) {
    saveTerm(input: $input) {
      cmsTermVo {
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
          academicYearId
          cmsAcademicYearVo {
            id
            description
            strStartDate
            strEndDate
          }
        }
      }
    }
  }
`;
