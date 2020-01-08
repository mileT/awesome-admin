# 项目介绍
本项目基于Spring Cloud 和Ant Design Pro实现前后端管理平台一站式脚手架，便于快速开发企业级应用。
项目实现：
1. admin-service基于Spring Cloud实现配置、注册、认证等通用组件
2. Spring Security基于Oauth2认证并生成JWT Token，并自定义SSO统一登录页面
3. 基于Ant Design Pro实现admin-ui, 前后端分离，使用Spring Security SSO登录页面登录，并基于JWT Token实现权限控制

# admin-service
## 描述
建立Spring Cloud常用微服务，包括配置服务、注册服务、认证服务，满足中小企业及个人基础框架开箱即用。支持采用阿里云云效服务和kubernetes容器服务实现生产级持续部署持续集成。

Spring cloud中最复杂的其实是认证服务，本项目认证服务已经支持
1. 实现Oauth2认证生成JWT Token
2. 定义统一登录页面实现sso登录
3. 支持自定义认证方式，实现多种方式认证
4. 支持直接通过API直接获取JWT Token，满足小程序、微信公众号等已经认证过需要直接获取token的场景

##### 启动服务
    - 首先启动config服务和registry服务
    - 启动auth服务
    - 通过注册服务http://localhost:8761 即可查看启动的服务
![注册服务](https://images.gitee.com/uploads/images/2019/1228/011228_0b1112e9_693977.png "WX20191228-010712@2x.png")


# admin-ui
## 描述
本项目基于 Ant Design Pro V4.0 定制开发，加入以下内容:
1. 通过Spring Security中的统一登录平台进行登录
2. 基于后台返回的jwt token 中的角色进行权限认证
3. 增加 nodejs server 端 Koa、Koa Router，可以直接部署
4. 增加 dockerfile 文件，可以通过k8s进行部署

## 启动

1. 安装依赖

```bash
sudo npm install tyarn -g
tyarn install
```

或者

```bash
sudo npm install cnpm -g
cnpm install
```

2. 启动项目

```bash
npm start
```

3. 启动服务端
至admin-ui目录下
```bash
node ./server/app.js
```

## 编译项目

```bash
npm run build
```

# login-ui
本项目用于Spring Security中的统一登录前端界面，实现后，需要将打包后的生产文件(build/)拷入微服务auth项目下（resources/public）

## 本地测试运行

```bash
$ npm install
$ npm start
```
## 打包
```bash
$ npm run build
```
# 效果
1. 浏览器输入localhost:8000后会自动跳转到登录页
![登录](https://images.gitee.com/uploads/images/2020/0108/141459_00154a24_804916.png "屏幕快照 2020-01-08 上午11.52.54.png")

2. 输入用户名和密码 admin/admin后,跳转到首页
![首页](https://images.gitee.com/uploads/images/2020/0108/141357_2b7b1df0_804916.png "屏幕快照 2020-01-08 上午11.53.15.png")

3. Cookie中JWT Token
![JWT Token](https://images.gitee.com/uploads/images/2020/0108/142112_b4feb450_804916.png "屏幕快照 2020-01-08 下午2.20.11.png")