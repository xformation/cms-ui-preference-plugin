import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const academicSettingsServices = {
    getCmsLectures,
    getCmsTerms,
    getCmsBatches,
    getCmsAcademicYears,
    getCmsSections,
    getGlobalConfiguration,
    getCmsSubjects,
    getCmsTeachers,
    getFilterAttendanceMasterByDepartment
}

function getCmsLectures() {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.LECTURES_URL + "?termId=1801&academicYearId=1701&sectionId=2052&batchId=2002&branchId=1901&departmentId=1951&subjectId=undefined&teacherId=undefined&fromDate=26-11-2019&toDate=undefined", requestOptions)
        .then(response => response.json());
}

function getCmsTerms(ayId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_TERM_BY_ACYEAR_URL + '?academicYearId=' + ayId, requestOptions)
        .then(response => response.json());
}

function getCmsBatches(departmentId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_BATCH_BY_DEPARTMENT_URL + departmentId, requestOptions)
        .then(response => response.json());
}

function getCmsAcademicYears(departmentId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_ACADEMICYEAR_URL + departmentId, requestOptions)
        .then(response => response.json());
}

function getCmsSections(batchId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_SECTION_BY_BATCH_URL + batchId, requestOptions)
        .then(response => response.json());
}

function getCmsSubjects(departmentId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_SUBJECT_BY_DEPARTMENT_URL + '?departmentId=' + departmentId, requestOptions)
        .then(response => response.json());
}

function getCmsTeachers(departmentId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_TEACHER_BY_FILTER_PARAM_URL + '?deptId=' + departmentId, requestOptions)
        .then(response => response.json());
}

function getFilterAttendanceMasterByDepartment(departmentId: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_AM_BY_DEPARTMENT_URL + '?deptId=' + departmentId, requestOptions)
        .then(response => response.json());
  }

function getGlobalConfiguration(userName: any) {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.CMS_GLOBAL_CONFIG_URL + '?userName=' + userName, requestOptions)
        .then(response => response.json());
}