import { config } from '../config';
import { commonFunctions } from '../_utilites/common.functions';

export const academicSettingsServices = {
    getCmsLectures
}

function getCmsLectures() {
    const requestOptions = commonFunctions.getRequestOptions("GET", {});
    return fetch(config.LECTURES_URL + "?termId=1801&academicYearId=1701&sectionId=undefined&batchId=2001&branchId=1901&departmentId=1951&subjectId=undefined&teacherId=undefined&fromDate=25-11-2019&toDate=undefined", requestOptions)
        .then(response => response.json());
}