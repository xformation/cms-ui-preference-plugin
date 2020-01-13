import gql from 'graphql-tag';

export const ADD_COLLEGE = gql`
  mutation AddCollege($input: CollegeInput) {
    addCollege(input: $input) {
      cmsCollegeVo {
        id
        collegeName
        logoFilePath
        logoFileName
        logoFileExtension
        logoFile
        createdBy
        updatedBy
        status
        strCreatedOn
        strUpdatedOn
        exitCode
        exitDescription
        branchList {
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
          startDate
          college {
            id
            collegeName
          }
          city {
            id
            cityName
            stdCode
          }
          state {
            id
            stateName
            country {
              id
              countryName
              countryCode
            }
          }
          strStartDate
          collegeId
          cityId
          stateId
          createdBy
          createdOn
          updatedBy
          updatedOn
          strCreatedOn
          strUpdatedOn
          exitCode
          exitDescription
          status
        }
      }
    }
  }
`;
