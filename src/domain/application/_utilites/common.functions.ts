export const commonFunctions: any = {
    getRequestOptions
};

function getRequestOptions(type: any, extraHeaders: any, body?: any) : any {
    let requestOptions: any = {};
    requestOptions = {
        method: type,
        headers: {
            ...extraHeaders,
        }
    };
    if (body) {
        requestOptions['body'] = body;
    }
    return requestOptions;
}