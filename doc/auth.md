# 认证

TOKEN在前端调用SDK初始化方法后拿到，传递给后端。以下是认证相关SOA接口定义，用于检测TOKEN是否合法。

## 接口依赖

```
<dependency>
  <groupId>me.ele.napos</groupId>
  <artifactId>luna-openapp-api</artifactId>
  <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 接口定义

```
service: me.ele.napos.luna.openapp.api.TokenService
public boolean checkToken(String appId, String token, int restaurantId) throws ServiceException;
```

## 服务名称

napos.openapp

##测试环境地址

vpca-napos-backend-01.vm.elenet.me:38195