import * as React from 'react';

export const commonFunctions = {
    getRequestOptions,
    createSelectbox
};

function getRequestOptions(type: any, extraHeaders: any, body: any) {
    let requestOptions: any = {};
    requestOptions = {
        method: type,
        headers: {
            ...extraHeaders,
        }
    };
    if (body) {
        requestOptions.body = body;
    }
    return requestOptions;
}

function createSelectbox(data: any, value: any, key: any, label: any){
    let retData = [];
    if(data.length > 0){
        for(let i=0;i<data.length;i++){
            let item = data[i];
            retData.push(
                <option value={item[value]} key={item[key]}>{item[label]}</option>
            );
        }
    }
    return retData;
}