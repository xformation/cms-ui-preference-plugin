const secSrvUrl = 'http://100.81.3.26:8094';
const apiUrl = 'http://100.81.3.26:8080/api';

export const config = {
  COLLEGE_URL: apiUrl + '/cmscollege',
  STATES_URL: apiUrl + '/states',
  CITIES_URL: apiUrl + '/cities',
  LECTURES_URL: apiUrl + '/cmslectures',
  CMS_TERM_BY_ACYEAR_URL: apiUrl + '/cmsterms-by_academicyearid',
  CMS_GLOBAL_CONFIG_URL: apiUrl + '/cmssettings',
  CMS_BATCH_BY_DEPARTMENT_URL: apiUrl + '/cmsbatches-departmentid/',
  CMS_ACADEMICYEAR_URL: apiUrl + '/cmsacademic-years/',
  CMS_SECTION_BY_BATCH_URL: apiUrl + '/cmssections-batchid/',
  CMS_SUBJECT_BY_DEPARTMENT_URL: apiUrl + '/cmssubjects-bydepartmentid',
  CMS_TEACHER_BY_FILTER_PARAM_URL: apiUrl + '/cmsteachers-qryprms',
  CMS_AM_BY_DEPARTMENT_URL: apiUrl + '/cmsattendance-masters-bydepartmentid',
};
