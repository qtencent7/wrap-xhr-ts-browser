// 1，创建xhr实例
const xhr = new XMLHttpRequest()

/**
 * xhr get 请求
 */

// 2，设置状态响应函数
xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
        const response = xhr.responseText
        console.log(response)
    }
}

// 3，初始化请求
xhr.open('GET', 'http://localhost:3000/api/user', true)

// 4，发送请求
xhr.send()

/**
 * xhr post 请求
 */

// 2，设置状态响应函数
xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200) {
        const response = xhr.responseText
        console.log(response)
    }
}

// 3，初始化请求
xhr.open('POST', 'http://localhost:3000/api/user', true)

// 设置请求头
xhr.setRequestHeader('Content-Type', 'application/json')

// 4，发送请求
xhr.send(JSON.stringify({name: '张三', age: 18}))