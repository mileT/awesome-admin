const url = 'http://localhost:3006';
const authUrl = 'http://localhost:5000';
module.exports = {
  app: 'app',
  secret: 'testpassword',

  // 前端后台页面请求token时配置请求到token后跳转的url，与登录界面配置的跳转url一致
  authPage: `${url}/auth`,
  // 前端后台获得token后实际跳转的页面，测试时可以配置到测试页面，测试页面的域名需要和跳转地址一致
  afterAuthUrl: 'http://localhost:8000/',

  // 后端请求token的auth 服务地址
  authServiceUrl: `${authUrl}/auth/oauth/token`,
};
