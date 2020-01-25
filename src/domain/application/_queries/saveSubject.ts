import gql from 'graphql-tag';

export const SAVE_SUBJECT = gql`
  mutation saveSubject($input: SubjectInput) {
    saveSubject(input: $input) {
      cmsSubjectVo {
        exitCode
        exitDescription
        dataList {
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
    }
  }
`;
