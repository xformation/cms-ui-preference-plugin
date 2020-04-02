import {config} from '../config';
import {commonFunctions} from '../_utilites/common.functions';

export const rbacSettingsServices = {
  getUserPermission,
  getUiModules,
  getSecurityPermissions,
  savePermission,
  getAllRoles,
  saveGroup,
  getAllUsers,
  saveUser,
  updateUser,
  importUser,
  createRole,
  // getGlobalConfiguration,
  // getCmsSubjects,
  // getCmsTeachers,
  // getFilterAttendanceMasterByDepartment,
  // saveLectures
};

function getUiModules() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.CMS_UI_MODULES_GET, requestOptions).then(response =>
    response.json()
  );
  // .then(data =>{

  // });
}

function getSecurityPermissions() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.PERMS_LIST_ALL, requestOptions).then(response => response.json());
}

function savePermission(data: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(config.PERMS_CREATE, requestOptions).then(response => response.json());
}

function getAllRoles() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.ROLES_LIST_ALL, requestOptions).then(response => response.json());
}

function saveGroup(data: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(config.ROLES_CREATE, requestOptions).then(response => response.json());
}

function getAllUsers() {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.USERS_LIST_ALL, requestOptions).then(response => response.json());
}

function saveUser(data: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(config.USERS_CREATE, requestOptions).then(response => response.json());
}

function updateUser(data: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(config.USERS_UPDATE, requestOptions).then(response => response.json());
}

function importUser(isTeacher: any, isStudent: any, isEmployee: any, branchId: any) {
  const requestOptions = commonFunctions.getRequestOptions('POST', {});
  return fetch(
    config.EXPORT_USER +
      '?chkTeacher=' +
      isTeacher +
      '&chkStudent=' +
      isStudent +
      '&chkEmployee=' +
      isEmployee +
      '&branchId=' +
      branchId,
    requestOptions
  ).then(response => response.json());
}

function createRole(data: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(config.ROLES_CREATE, requestOptions).then(response => response.json());
}

function getUserPermission(userName: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(
    config.CMS_GLOBAL_CONFIG_URL + '?userName=' + userName,
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
