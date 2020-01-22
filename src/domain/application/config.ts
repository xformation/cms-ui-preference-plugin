const secSrvUrl = 'http://100.81.3.26:8094';
const apiUrl = 'http://100.81.3.26:8080/api';

const graphqlUrl = 'http://100.81.3.26:9091';
const loggedInUserUrl = 'http://100.81.3.26:3000';
const webSockWithCmsBackendUrl = 'ws://100.81.3.26:4000/websocket/tracker/websocket';

export const config = {
  GRAPHQL_URL: graphqlUrl + '/graphql',
  LOGGED_IN_USER_URL: loggedInUserUrl + '/api/user',
  WEB_SOCKET_URL_WITH_CMS_BACKEND: webSockWithCmsBackendUrl,

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
