# 管理后台 V1.0.0

## 描述

本项目基于 Ant Design Pro V4.0 定制开发，加入以下内容:

1. 通过统一登录平台进行登录
2. 基于后台返回的 jwt token 中的角色进行权限认证
3. 增加 nodejs server 端 Koa、Koa router
4. 使用 dockerfile 进行部署

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

## 编译项目

```bash
npm run build
```
