export const commonFunctions: any = {
  getRequestOptions,
  validateEmail,
  changeTextBoxBorderToError,
  restoreTextBoxBorderToNormal,
};

function getRequestOptions(type: any, extraHeaders: any, body?: any): any {
  let requestOptions: any = {};
  requestOptions = {
    method: type,
    headers: {
      ...extraHeaders,
    },
  };
  if (body) {
    requestOptions['body'] = body;
  }
  return requestOptions;
}

function validateEmail(emailId: any) {
  const regx = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
  return regx.test(emailId);
}

function changeTextBoxBorderToError(textBoxValue: any, objName: any) {
  if (textBoxValue.trim() === '') {
    const obj: any = document.querySelector('#' + objName);
    obj.className = 'gf-form-input input-textbox-error';
  }
  if (objName === 'emailId') {
    const obj: any = document.querySelector('#' + objName);
    obj.className = 'gf-form-input input-textbox-error';
  }
}

function restoreTextBoxBorderToNormal(objName: any) {
  const obj: any = document.querySelector('#' + objName);
  obj.className = 'gf-form-input';
}
