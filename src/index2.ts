
interface XHROptions {
    baseUrl: string
}
interface XHR extends XHROptions {
    url: string,
    xhr: XMLHttpRequest
}
interface Params {
    [key: string]: number | string;
}
function XHRRequest(this: XHR, options: XHROptions){
    const { baseUrl } = options;
    this.baseUrl = baseUrl;
    this.xhr = new XMLHttpRequest();
}

function AdapterWithParams(this: XHR, url: string, data: Params) {
    let URL = this.baseUrl + url;
    let params = '';
    for (const key in data) {
        params += `${key}=${data[key]}&`
    }
    params = params.slice(0, -1);
    URL += '?' + params;
    return resolvePromise(this.xhr, URL)
}
export let retryCount = 10
export let retryDelay = 1000

async function resolvePromise(xhr: XMLHttpRequest, URL: string, attempt = 1) {
    let done = false
    const p = new Promise((resolve, reject) => {
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText)
                done = true
            } else if (attempt < retryCount) {
                console.log(`Attempt ${attempt} failed. Retrying...`)
            } else {
                reject(
                    `Request failed after ${retryCount} attempts.`
                )
                done = true
            }
        }
    })
    function request(xhr: XMLHttpRequest, URL: string, resolve?: any) {
        xhr.open('GET', URL, false);
        xhr.send();
        attempt = attempt + 1
        resolve?.('')
    }
    request(xhr, URL)
    while(!done) {
        await new Promise(resolve => setTimeout(() => request(xhr, URL, resolve), retryDelay))
    }
    return p
}
function AdapterWithData(this: XHR, url: string, data: any) {
    let URL = this.baseUrl + url;
    return resolvePromiseWithData(this.xhr, URL, data)
}
function withDataSendData(xhr: XMLHttpRequest, data: any) {
    if (data instanceof FormData) {
        xhr.send(data);
    }
    else if (data instanceof Object) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
}
async function resolvePromiseWithData(xhr: XMLHttpRequest, URL: string, data: any, attempt = 1) {
    let done = false
    const p = new Promise((resolve, reject) => {
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText)
                done = true
            } else if (attempt < retryCount) {
                console.log(`Attempt ${attempt} failed. Retrying...`)
            } else {
                reject(
                    `Request failed after ${retryCount} attempts.`
                )
                done = true
            }
        }
    })
    function request(xhr: XMLHttpRequest, URL: string, data: any, resolve?: any) {
        xhr.open('POST', URL, false);
        xhr.send(JSON.stringify(data));
        attempt = attempt + 1
        resolve?.('')
    }
    request(xhr, URL, data)
    while(!done) {
        await new Promise(resolve => setTimeout(() => request(xhr, URL, data, resolve), retryDelay))
    }
    return p
}
['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
    if (method === 'get') {
        XHRRequest.prototype[method] = AdapterWithParams
    }
    else {
        XHRRequest.prototype[method] = AdapterWithData
    }
})
export default XHRRequest
