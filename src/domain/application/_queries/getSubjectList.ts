import gql from 'graphql-tag';

export const GET_SUBJECT_LIST = gql`
  query {
    getSubjectList {
      id
      subjectCode
      subjectType
      subjectDesc

      createdBy
      updatedBy
      strCreatedOn
      strUpdatedOn
      status
      departmentId
      cmsDepartmentVo {
        id
        name
      }
      batchId
      cmsBatchVo {
        id
        batch
        description
        departmentId
        cmsDepartmentVo {
          id
          name
        }
      }
      teacherId
      cmsTeacherVo {
        id
        teacherName
      }
      sectionId
      cmsSectionVo {
        id
        section
      }
    }
  }
`;
