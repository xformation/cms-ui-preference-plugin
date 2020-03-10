//const IP = 'localhost';
const IP = '100.81.5.25';

const secSrvUrl = 'http://' + IP + ':8094';
const preferenceRestUrl = 'http://' + IP + ':9091/api';
const backendRestUrl = 'http://' + IP + ':8080/api';

const graphqlUrl = 'http://' + IP + ':9091';
const loggedInUserUrl = 'http://' + IP + ':3000';
const webSockWithCmsBackendUrl = 'ws://' + IP + ':4000/websocket/tracker/websocket';

export const config = {
  GRAPHQL_URL: graphqlUrl + '/graphql',
  LOGGED_IN_USER_URL: loggedInUserUrl + '/api/user',
  WEB_SOCKET_URL_WITH_CMS_BACKEND: webSockWithCmsBackendUrl,

  // COLLEGE_URL: preferenceRestUrl + '/cmscollege',
  // STATES_URL: preferenceRestUrl + '/states',
  // CITIES_URL: preferenceRestUrl + '/cities',
  LECTURES_URL: preferenceRestUrl + '/cmslectures',
  CMS_TERM_BY_ACYEAR_URL: preferenceRestUrl + '/cmsterms-by_academicyearid',
  CMS_BATCH_BY_DEPARTMENT_URL: preferenceRestUrl + '/cmsbatches-departmentid/',
  CMS_ACADEMICYEAR_URL: preferenceRestUrl + '/cmsacademic-years/',
  CMS_SECTION_BY_BATCH_URL: preferenceRestUrl + '/cmssections-batchid/',
  CMS_SUBJECT_BY_DEPARTMENT_URL: preferenceRestUrl + '/cmssubjects-bydepartmentid',
  CMS_TEACHER_BY_FILTER_PARAM_URL: preferenceRestUrl + '/cmsteachers-qryprms',
  CMS_AM_BY_DEPARTMENT_URL: preferenceRestUrl + '/cmsattendance-masters-bydepartmentid',
  CMS_UPLOAD_MASTER_DATA_URL: preferenceRestUrl + '/cmsdataimport',
  MS_ACCESS_TOKEN_URL: preferenceRestUrl + '/cms-ms-authenticate',

  CMS_GLOBAL_CONFIG_URL: backendRestUrl + '/cmssettings',
  CMS_LECTURE_URL: backendRestUrl + '/cmslectures',
  CMS_UI_MODULES_GET: backendRestUrl + '/cmsmodules',

  PERMS_LIST_ALL: secSrvUrl + '/security/permissions/listAll',
  PERMS_CREATE: secSrvUrl + '/security/permissions/create',
};
