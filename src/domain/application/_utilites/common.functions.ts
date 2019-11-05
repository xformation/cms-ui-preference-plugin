export const commonFunctions = {
    getRequestOptions
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