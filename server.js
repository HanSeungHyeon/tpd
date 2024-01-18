const Koa = require('koa');
const serve = require('koa-static');
const send = require('koa-send');
const path = require('path');
const app = new Koa();

app.use(serve(path.join(__dirname, 'static/')));
app.use(async (ctx) => {
    await send(ctx, 'page/index.html', { root: path.join(__dirname, 'static') });
});

app.listen(5000, () => {
    console.log(`server listening 5000 port`);
});