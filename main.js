var http = require('http')
var fs = require('fs')
var url = require('url')
var qs = require('querystring')
let path = require('path')
let template = require('./lib/template.js')
// let sanitize = require('sanitize-html') -> 번거롭다.
let xss = require('xss')

let readFile = (queryData, description, title, list, response, hasId) => {
    let filteredId = hasId ? path.parse(queryData.id).base : '';
    fs.readFile(`data/${filteredId}`, 'utf8', (err, data) => {
        description = data ? data : xss(description)
        let cleanTitle = xss(title)
        let html;
        if(hasId) {
            html = template.html(cleanTitle, list,
                `<h2>${cleanTitle}</h2>${description}`,
                `<a href="/create">create</a> <a href="/update?id=${cleanTitle}">update</a>
                        <form action="delete_process" method="post" >
                            <input type="hidden" name="id" value="${cleanTitle}">
                            <input type="submit" value="delete"> 
                        </form>`
            )
        } else {
            html = template.html(cleanTitle, list,
                `<h2>${cleanTitle}</h2>${description}`,
                `<a href="/create">create</a>`)
        }
        response.writeHead(200)
        response.end(html)
    })
}

let app = http.createServer((request, response) => {
    let _url = request.url
    let queryData = url.parse(_url, true).query
    let pathname = url.parse(_url, true).pathname
    let title = queryData.id
    let description;

    // root
    if(pathname === '/') {
        // filelist ul 태그 그리기
        let list;

        // id query가 없으면 셋팅할 값
        if(!queryData.id) {
            title = 'Welcome'
            description = 'Hello, Node.js'
            // 파일 목록 가져오기
            fs.readdir('./data/', (err, fileList) => {
                list = template.list(fileList)
                readFile(queryData, description, title, list, response, false);
            })
        } else {
            // 파일 목록 가져오기
            fs.readdir('./data/', (err, fileList) => {
                list = template.list(fileList)
                readFile(queryData, description, title, list, response, true);
            })
        }
    } else if (pathname === '/create') {
        title = 'WEB - create'
        fs.readdir('./data/', (err, fileList) => {
            list = template.list(fileList)
            let html = template.html(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"/></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `)
            response.writeHead(200)
            response.end(html)
        })
    } else if (pathname === '/create_process') {
        let body = '';
        request.on('data', data => {
            body += data
        })
        request.on('end', () => {
            var post = qs.parse(body)
            let filteredId = path.parse(post.title).base
            fs.writeFile(`data/${filteredId}`, xss(post.description), 'utf8', err => {
                if(err) throw err
                response.writeHead(302, {Location: `/?id=${filteredId}`})
                response.end()
            })
        })
    } else if (pathname === '/update') {
        fs.readdir('./data', (err, filelist) => {
            let filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
                list = template.list(filelist)
                let cleanTitle = xss(title);
                let cleanDescription = xss(description);
                let html = template.html(title, list,
            `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${cleanTitle}">
                        <p><input type="text" name="title" placeholder="title" value="${cleanTitle}"/></p>
                        <p>
                            <textarea name="description" placeholder="description">${cleanDescription}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                `,
                    `<a href="/create">create</a> <a href="/update?id=${cleanTitle}">update</a>`)
                response.writeHead(200)
                response.end(html)
            })
        })
    } else if (pathname === '/update_process') {
        let body = '';
        request.on('data', data => {
            body += data
        })
        request.on('end', () => {
            let post = qs.parse(body)
            let title = xss(post.title);
            let id = post.id;
            let description = xss(post.description)
            let filteredId = path.parse(id).base
            fs.rename(`data/${filteredId}`, `data/${title}`, err => {
                if(err) throw err
                fs.writeFile(`data/${title}`, description, 'utf8', err => {
                    if(err) throw err
                    console.log('The file has been changed!')
                    response.writeHead(302, {Location: `/?id=${title}`})
                    response.end()
                })
            })
        })
    } else if (pathname === '/delete_process') {
        let body = '';
        request.on('data', data => {
            body += data
        })
        request.on('end', () => {
            let post = qs.parse(body)
            let filteredId = path.parse(post.id).base
            fs.unlink(`data/${filteredId}`, err => {
                if(err) throw err
                response.writeHead(302, {Location: `/`})
                response.end()
            })
        })
    } else { // 페이지 404
        response.writeHead(404)
        response.end(`<h1>404 Nof Found</h1>`)
    }
})
app.listen(3000)