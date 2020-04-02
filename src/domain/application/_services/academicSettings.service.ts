import {config} from '../config';
import {commonFunctions} from '../_utilites/common.functions';

export const academicSettingsServices = {
  getCmsLectures,
  getCmsTerms,
  getCmsBatches,
  getCmsAcademicYears,
  getCmsSections,
  getGlobalConfiguration,
  getCmsSubjects,
  getCmsTeachers,
  getFilterAttendanceMasterByDepartment,
  saveLectures,
};

function getCmsLectures(data: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.LECTURES_URL +
      `?termId=${data.selectedTerm}&academicYearId=${data.academicYearId}&sectionId=${
        data.selectedSection
      }&batchId=${data.selectedBatch}&branchId=${data.selectedBranch}&departmentId=${
        data.departmentId
      }&subjectId=${data.selectedSubject}&teacherId=${data.selectedTeacher}&fromDate=${
        data.fromDate
      }&toDate=${data.toDate}`,
    requestOptions
  ).then(response => response.json());
}

function getCmsTerms(ayId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.CMS_TERM_BY_ACYEAR_URL + '?academicYearId=' + ayId,
    requestOptions
  ).then(response => response.json());
}

function getCmsBatches(departmentId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.CMS_BATCH_BY_DEPARTMENT_URL + departmentId, requestOptions).then(
    response => response.json()
  );
}

function getCmsAcademicYears(departmentId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.CMS_ACADEMICYEAR_URL + departmentId, requestOptions).then(
    response => response.json()
  );
}

function getCmsSections(batchId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.CMS_SECTION_BY_BATCH_URL + batchId, requestOptions).then(response =>
    response.json()
  );
}

function getCmsSubjects(departmentId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.CMS_SUBJECT_BY_DEPARTMENT_URL + '?departmentId=' + departmentId,
    requestOptions
  ).then(response => response.json());
}

function getCmsTeachers(departmentId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.CMS_TEACHER_BY_FILTER_PARAM_URL + '?deptId=' + departmentId,
    requestOptions
  ).then(response => response.json());
}

function getFilterAttendanceMasterByDepartment(departmentId: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.CMS_AM_BY_DEPARTMENT_URL + '?departmentId=' + departmentId,
    requestOptions
  ).then(response => response.json());
}

function getGlobalConfiguration(userName: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.CMS_GLOBAL_CONFIG_URL + '?userName=' + userName,
    requestOptions
  ).then(response => response.json());
}

function saveLectures(data: any, params: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(
    `${config.LECTURES_URL}?termId=${params.termId}&academicYearId=${
      params.academicYearId
    }&sectionId=${params.sectionId}&batchId=${params.batchId}&branchId=${
      params.branchId
    }&departmentId=${params.departmentId}`,
    requestOptions
  ).then(response => response.json());
}
