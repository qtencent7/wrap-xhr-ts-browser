function xhrWithRetry(config) {
    const { url, retryCount = 3, retryDelay = 1000 } = config

    function makeRequest(attempt = 1) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.open('GET', url)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText)
                } else if (attempt < retryCount) {
                    // 重试逻辑
                    console.log(`Attempt ${attempt} failed. Retrying...`)
                    setTimeout(() => makeRequest(attempt + 1), retryDelay)
                } else {
                    reject(
                        new Error(
                            `Request failed after ${retryCount} attempts.`
                        )
                    )
                }
            }
            xhr.onerror = function () {
                if (attempt < retryCount) {
                    console.log(
                        `Attempt ${attempt} failed due to error. Retrying...`
                    )
                    setTimeout(() => makeRequest(attempt + 1), retryDelay)
                } else {
                    reject(
                        new Error(
                            `Request failed after ${retryCount} attempts due to error.`
                        )
                    )
                }
            }
            xhr.ontimeout = function () {
                if (attempt < retryCount) {
                    console.log(`Attempt ${attempt} timed out. Retrying...`)
                    setTimeout(() => makeRequest(attempt + 1), retryDelay)
                } else {
                    reject(
                        new Error(
                            `Request failed after ${retryCount} attempts due to timeout.`
                        )
                    )
                }
            }

            xhr.send()
        })
    }

    return makeRequest()
}

// 使用示例
xhrWithRetry({ url: 'https://api.example.com/data' })
    .then((response) => {
        console.log('Response received:', response)
    })
    .catch((error) => {
        console.error('Request failed:', error.message)
    })
