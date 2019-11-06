import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const collegeSettingsServices = {
    saveCollege,
    getStates,
    getCities
}

function saveCollege(data: any) {
    const requestOptions = commonFunctions.getRequestOptions("POST", {"Content-Type":"application/json;charset=UTF-8"}, JSON.stringify(data));
    return fetch(config.COLLEGE_URL, requestOptions)
        .then(response => response.json());
}

function getStates(){
    const requestOptions = commonFunctions.getRequestOptions("GET", {}, null);
    return fetch(config.STATES_URL, requestOptions)
        .then(response => response.json());
}

function getCities(){
    const requestOptions = commonFunctions.getRequestOptions("GET", {}, null);
    return fetch(config.CITIES_URL, requestOptions)
        .then(response => response.json());
}