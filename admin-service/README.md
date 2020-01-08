# Spring Cloud全家桶V1.0.1

## 描述
建立spring cloud常用微服务，包括配置服务、注册服务、认证服务，满足中小企业及个人基础框架开箱即用。
同时在readme中尽可能将各服务的实现讲解清除以便于二次开发。
建议采用阿里云云效服务和kubernetes容器服务实现生产级持续部署持续集成。

Spring cloud中最复杂的其实是认证服务，本项目认证服务已经支持
1. OAuth2 authorize_code认证，包括常用的用户名密码及手机号码验证码等其他方式登录
2. 微信服务号或者小程序直接登录

## 使用前步骤
使用之前需安装JDK8.0以上、Git、IntelliJ
##### 1. git clone https://gitee.com/awesome-engineer/spring-cloud-family-bucket.git
##### 2. 打开IntelliJ导入项目


![输入图片说明](https://images.gitee.com/uploads/images/2019/1228/003620_17afa166_693977.png "WX20191228-002916@2x.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/1228/003647_bc39bc32_693977.png "WX20191228-002939@2x.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/1228/003657_0042abef_693977.png "WX20191228-003006@2x.png")
导入项目后依赖自动同步后如下图所示
![输入图片说明](https://images.gitee.com/uploads/images/2019/1218/174704_cf08eb07_804916.jpeg "1.jpg")

##### 3. 启动服务
    - 首先启动config服务和registry服务（不分先后，因为config服务并不需要注册至registry服务）
    - 启动auth服务
    - 启动其他服务
##### 4. 在浏览器中输入 http://localhost:8761 即可查看启动的服务

![输入图片说明](https://images.gitee.com/uploads/images/2019/1228/011228_0b1112e9_693977.png "WX20191228-010712@2x.png")

## 架构讲解

### 服务配置讲解
##### config服务中读取配置
本项目各个服务均从config配置服务读取配置信息。所以首先要配置config服务，其次每个服务需要配置config服务的uri和访问密码，最后在config服务中配置各服务的配置文件
1. 配置config服务, 

```
spring:
  cloud:
    config:
      server:
        native:
          search-locations: classpath:/shared
  profiles:
     active: native
  security:
    user:
      password: testpassword

server:
  port: 8888
```
该配置定义
- 各个服务的配置文件地址为classpath:/shared, 即resource下shared文件位置，本项目未会将config中各服务的配置文件放在git中而不是放在config服务文件夹下。查看config服务resource/shared文件夹下即可看见各服务的配置文件
- 配置访问config的用户名和密码分别为 user/testpassword, 因此其它服务要访问config获取自身的配置文件需要配置user/testpassword作为用户名和密码
- config端口为8888
最终config服务uri为http://localhost:8888, 用户名和密码为user/testpassword
2. 配置各服务连接到config服务读取配置(registry和config服务自身除外)
```
spring:
  application:
    name: auth
  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true
      username: user
      password: testpassword
      profile: dev
```
以Auth为例，配置了服务名称为auth，config的uri、是否快速失败、用户名和密码、以及配置文件类型。auth服务启动时会自动向config读取文件名为[服务名]-[配置文件类型].yml, 即auth-dev.yml配置。生产环境将dev改为prod即会读取auth-prod.yml的配置从而实现测试和生产环境两套不同的配置。

3. 在config服务中添加各服务的配置文件
同样以auth服务为例，只需要在config服务的resource/shared文件加下添加auth.yml文件即可，文件中加入auth服务的配置信息。
查看config服务resource/shared文件夹下各服务配置。
auth-dev.yml和auth-prod.yml为auth服务测试及生产配置文件
application.yml为各服务通用配置文件，各服务出来加载服务自身的配置文件同时会加载application.yml中的配置，所以各服务通用配置可以定义在application.yml中，注意下面还有个application.yml为config服务本身的配置文件，不要混淆

![配置文件](https://images.gitee.com/uploads/images/2019/1218/190947_c0bc8f28_804916.png "屏幕截图.png")

##### 注册到registry服务

config服务中resources/shared/application.yml中定义所有服务通用配置,里面包括了注册到registry服务
```
# 配置注册服务uri，如果有多个registry实例，可以配置多个uri，使用逗号分隔
eureka:
  instance:
    prefer-ip-address: true
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
#      defaultZone: http://registry:8761/eureka/,http://registry1:8762/eureka/

#请求处理的超时时间
ribbon:
  ReadTimeout: 12000
#请求连接的超时时间
  ConnectTimeout: 5000
```

#### 认证服务讲解
基本流程
1.  AuthenticationFilter拦截请求，Spring sercurity预先定义了一系列的filter放在Filter Chain中，
每个filter会拦截特定的url生成未认证的AuthenticationToken，该token包括认证信息，常用的如用户名和密码
2.  AuthenticationManager根据AuthenticationFilter分配AuthenticationProvider， 实际上AuthenticationManager会遍历
所有的AuthenticationProvider的supports()方法，如果支持就调用AuthenticationProvider的authenticate()方法去认证。通常我们
可以定义自己的AuthenticationProvider用于实现认证
3. AuthenticationProvider中在实现认证后生成认证的AuthenticationToken， 该步骤一般会查询数据库查询用户的UserDetails加入一些用户信息
同时放入AuthenticationToken中
4. Spring Security会将上一步骤中生成的AuthenticationToken存放在SecurityContextHolder中用于最终返回

#####配置auth服务token密钥
https://www.jianshu.com/p/c9d5a2aa8648

##### 获取client credential token
http://localhost:5000/auth/oauth/token?grant_type=client_credentials
使用basic认证

##### 默认认证方式 获取authorization_code token
前端页面<Form onSubmit={this.handleSubmit} action='./login' method='POST'>

##### 自定义认证认证方式 获取authorization_code token
<Form onSubmit={this.handleSubmit} action='./oauth/custom/token' method='POST'>

1. 登录页面
http://localhost:5000/auth/oauth/authorize?response_type=code&client_id=app&redirect_uri=http://localhost:3000/auth

2. 获取token 注意更换code参数，使用basic认证
http://localhost:5000/auth/oauth/token?grant_type=authorization_code&code=8XVZkV&redirect_uri=http://localhost:3000/auth

##### 定义controller直接获取jwt token
http://localhost:5000/auth/api/external/token
client_credentials 认证
参数
{
	"principal": "test user",
	"auth_type": "auth_finished",
	"grant_type": "mini_app"
}


#### 阿里云部署


#### 贡献


#### 参考

