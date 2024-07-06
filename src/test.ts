const request = new XHRRequest({
    baseUrl: 'http://localhost:3000',
})
request
    .get('/get-test', {
        name: '张三',
        age: 18,
    })
    .then((res) => {
        console.log(res)
    })

request
    .post('/post-test', {
        name: '张三',
        age: 18,
    })
    .then((res) => {
        console.log(res)
    })
