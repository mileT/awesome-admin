const Router = require('koa-router');
const k2c = require('koa2-connect');
const send = require('koa-send');
const proxy = require('http-proxy-middleware');
const path = require('path');
const util = require('./utils');
const appConfig = require('./appConfig');

const authUrl = code =>
  `${appConfig.authServiceUrl}?grant_type=authorization_code&code=${code}&redirect_uri=${appConfig.authPage}`;

const authResponse = async ctx => {
  const url = authUrl(ctx.query.code);
  const options = {
    auth: {
      user: appConfig.app,
      password: appConfig.secret,
      sendImmediately: false,
    },
  };

  const body = await util.post(url, options);
  // ctx.set("token", body);
  ctx.cookies.set('token', Buffer.from(body).toString('base64'), {
    maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
    httpOnly: false,
    overwrite: true,
  });
  ctx.status = 302;
  ctx.redirect(appConfig.afterAuthUrl);
};

module.exports = app => {
  // proxy middleware options
  const options = {
    target: 'http://service-url',
    changeOrigin: true,
  };

  const router = new Router();
  router
    .get('/auth', authResponse)
    .all('/serivce/api/*', k2c(proxy(options)))
    .get('/*', async ctx => {
      await send(ctx, 'index.html', { root: path.resolve(__dirname, '../dist') });
    });

  app.use(router.routes());
};
