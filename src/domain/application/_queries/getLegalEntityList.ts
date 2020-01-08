import gql from 'graphql-tag';

export const GET_LEGAL_ENTITY_LIST = gql`
  query {
    getLegalEntityList {
      id
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
`;
