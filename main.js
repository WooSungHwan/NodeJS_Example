var http = require('http')
var fs = require('fs')
var url = require('url')

let templateHTML = (title, list, body) => {
    return `<!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body> 
              <h1><a href="/">WEB</a></h1>
              ${list}
              ${body}
            </body>
            </html>`
}

let templateList = fileList => {
    let list = '<ul>'
    let i = 0
    while (i < fileList.length) {
        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
        i += 1
    }
    list = list + '</ul>'
    return list
}

let readFile = (queryData, description, title, list, response) => {
    fs.readFile(`data/${queryData.id}`, 'utf8', (err, data) => {
        description = data ? data : description
        let template = templateHTML(title, list, `<h2>${title}</h2>${description}`)
        response.writeHead(200)
        response.end(template)
    })
}

var app = http.createServer((request, response) => {
    let _url = request.url
    let queryData = url.parse(_url, true).query
    let pathname = url.parse(_url, true).pathname
    let title = queryData.id
    let description;

    // root
    if(pathname === '/') {
        // id query가 없으면 셋팅할 값
        if(!queryData.id) {
            title = 'Welcome'
            description = 'Hello, Node.js'
        }

        // filelist ul 태그 그리기
        var list;

        // 파일 목록 가져오기
        fs.readdir('./data/', (err, fileList) => {
            list = templateList(fileList)
            readFile(queryData, description, title, list, response);
        })
    } else { // 페이지 404
        response.writeHead(404)
        response.end(`<h1>404 Nof Found</h1>`)
    }
})
app.listen(3000)