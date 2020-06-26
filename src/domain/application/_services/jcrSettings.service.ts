import {config} from '../config';
import {commonFunctions} from '../_utilites/common.functions';

export const jcrSettingsServices = {
  save,
  getCloudInfoList,
};

function save(url: any, data: any) {
  const requestOptions = commonFunctions.getRequestOptions(
    'POST',
    {'Content-Type': 'application/json;charset=UTF-8'},
    JSON.stringify(data)
  );
  return fetch(url, requestOptions).then(response => response.json());
}

function getCloudInfoList(url: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(url, requestOptions).then(response => response.json());
}
