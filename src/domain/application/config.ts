const secSrvUrl = 'http://100.81.3.25:8094';
const apiUrl = 'http://100.81.3.25:8080';

const PROTOCOL = 'http';
const IP = '100.81.3.25'; //18.209.4.2
const PORT = '8080';
const ROOT_API = 'api';
const BASE_URL = PROTOCOL + '://' + IP + ':' + PORT + '/' + ROOT_API;

export const config = {
    COLLEGE_URL: BASE_URL + '/cmscollege',
    STATES_URL: BASE_URL + '/states',
    CITIES_URL: BASE_URL + '/cities'
}