import {config} from '../config';
import {commonFunctions} from '../_utilites/common.functions';

export const paymentSettingsServices = {
  getMessage,
};

function getMessage(amt: any) {
  const requestOptions = commonFunctions.getRequestOptions('GET', {});
  return fetch(config.PAYMENT_MSG_URL + '/' + amt, requestOptions).then(response =>
    response.json()
  );
  // .then(data =>{

  // });
}
