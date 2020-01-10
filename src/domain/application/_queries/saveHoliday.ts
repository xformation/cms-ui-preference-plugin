import gql from 'graphql-tag';

export const SAVE_HOLIDAY = gql`
  mutation saveHoliday($input: HolidayInput) {
    saveHoliday(input: $input) {
      cmsHolidayVo {
        exitCode
        exitDescription
        dataList {
          id
          description
          comments
          strHolidayDate
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
