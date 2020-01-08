const Koa = require('koa');

const staticFile = require('koa-static');

const path = require('path');

const route = require('./route');

const app = new Koa();

app.use(staticFile(path.resolve(__dirname, '../dist')));
route(app);
app.listen(3006);
// console.log('app started at port 3000...');
