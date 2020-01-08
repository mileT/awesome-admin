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
