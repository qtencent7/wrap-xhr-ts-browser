import XHRRequest from './index2'

const request = new XHRRequest({
    baseUrl: 'http://localhost:3000',
})
// request
//     .get('/get-test1', {
//         name: '张三',
//         age: 18,
//     })
//     .then((res: any) => {
//         console.log(res)
//     })
//     .catch((err: any) => {
//         console.log(err)
//     })

request
    .post('/post-test1', {
        name: '张三',
        age: 18,
    })
    .then((res: any) => {
        console.log(res)
    })
    .catch((err: any) => {
        console.log(err)
    })
const inputDom = document.createElement('input')
inputDom.type = 'file'
const appDom = document.getElementById('app')
appDom?.appendChild(inputDom)
inputDom.onchange = (e: any) => {
    const file = e.target.files[0]
    console.log(file)
    const formData = new FormData()
    formData.append('file', file)
    request.post('/post-file-upload', formData).then((res: any) => {
        console.log(res)
    })
}

