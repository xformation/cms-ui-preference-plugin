import gql from 'graphql-tag';

export const SAVE_LEGAL_ENTITY = gql`
  mutation saveLegalEntity($input: LegalEntityInput) {
    saveLegalEntity(input: $input) {
      cmsLegalEntityVo {
        exitCode
        exitDescription
        logoFile
        logoFilePath
        logoFileName
        logoFileExtension
        legalNameOfCollege
        typeOfCollege
        registeredOfficeAddress
        collegeIdentificationNumber
        pan
        tan
        tanCircleNumber
        citTdsLocation
        formSignatory
        pfNumber
        pfSignatory
        esiNumber
        esiSignatory
        ptNumber
        ptSignatory
        strDateOfIncorporation
        strPfRegistrationDate
        strEsiRegistrationDate
        strPtRegistrationDate
        createdBy
        updatedBy
        strCreatedOn
        strUpdatedOn
        status
        branchId
        cmsBranchVo {
          id
          branchName
          address
        }
      }
    }
  }
`;
