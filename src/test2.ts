function retryAdapterEnhancer(adapter, options) {
    const { times = 0, delay = 300 } = options

    return async (config) => {
        const { retryTimes = times, retryDelay = delay } = config
        let __retryCount = 0
        const request = async () => {
            try {
                return await adapter(config)
            } catch (err) {
                // 判断是否进行重试
                if (!retryTimes || __retryCount >= retryTimes) {
                    return Promise.reject(err)
                }
                __retryCount++ // 增加重试次数
                // 延时处理
                const delay = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, retryDelay)
                })
                // 重新发起请求
                return delay.then(() => {
                    return request()
                })
            }
        }
        return request()
    }
}
