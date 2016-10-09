const Koa = require('koa');
const router = require('koa-router')();// 注意require('koa-router')返回的是函数:
const bodyParser = require('koa-bodyparser');
const fs = require("fs");
const app = new Koa();



// 先导入fs模块，然后用readdirSync列出文件
// 这里可以用sync是因为启动时只运行一次，不存在性能问题:
var files = fs.readdirSync(__dirname + '/controllers');

// 过滤出.js文件:
//var js_files = files.filter((f) => {
//    return f.endsWith('.js');
//}, files);

var js_files = files.filter(function (f) {
    return f.endsWith('.js');
}, files);

// 处理每个js文件:
for (var f of js_files) {
    console.log(`process controller: ${f}...`);
    // 导入js文件:
    let mapping = require(__dirname + '/controllers/' + f);
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(4);

            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}

// add router middleware:
app.use(router.routes());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');