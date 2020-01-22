import gql from 'graphql-tag';

export const GET_STAFF_LIST = gql`
  query {
    getTeacherList {
      id
      uploadPhoto
      logoFilePath
      logoFileName
      logoFileExtension
      logoFile
      teacherName
      teacherMiddleName
      teacherLastName
      fatherName
      fatherMiddleName
      fatherLastName
      spouseName
      spouseMiddleName
      spouseLastName
      motherName
      motherMiddleName
      motherLastName
      aadharNo
      panNo
      dateOfBirth: placeOfBirth
      religion
      caste
      subCaste
      sex
      bloodGroup
      address
      town
      state
      country
      pinCode
      teacherContactNumber
      alternateContactNumber
      teacherEmailAddress
      alternateEmailAddress
      relationWithStaff
      emergencyContactName
      emergencyContactMiddleName
      emergencyContactLastName
      emergencyContactNo
      emergencyContactEmailAddress
      status
      employeeId
      designation
      staffType
      departmentId
      cmsDepartmentVo {
        id
        name
      }
      branchId
      cmsBranchVo {
        id
        branchName
      }
    }
  }
`;
