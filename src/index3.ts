// 需求整理：
// 1，对于是否需要请求超时重试，可以以插件的方式去使用它
// 2，构建核心请求逻辑，构建插件代码入口，使得便于使用

interface XHROptions {
    baseUrl: string,
    resInterceptors: Array<ResInterceptor>,
}
interface RequestOptions {
    method: string,
    data?: any
}
interface InterceptorOptions extends RequestOptions{
    url: string,
}
type ResInterceptor = (xhrRequest: XHRRequest, options: InterceptorOptions) => void

class XHRRequest {
    baseUrl: string
    resInterceptors: Array<Function>

    constructor(options: XHROptions) {
        const { baseUrl, resInterceptors } = options;
        this.baseUrl = baseUrl;
        this.resInterceptors = resInterceptors;
    }

    request(url: string, options: RequestOptions) {
        const interceptorOptions = Object.assign({}, options, { url });
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            this.resInterceptors.forEach(interceptor => {
                interceptor(this, interceptorOptions);
            })
        }
        this.send(xhr, url, options);
    }

    send(xhr: XMLHttpRequest, url: string, options: RequestOptions) {
        const { method, data } = options;
        xhr.open(method, url, false);
        xhr.send(data);
    }

    
}
