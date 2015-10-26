# 使用方法

1. 可以通过以下三种方式获得 JS-SDK:
  - clone & build [this repository](https://github.com/eleme/napos-jssdk)
  - via Bower: by running `$ bower install napos-jssdk` from your console
  - or via npm: by running `$ npm install napos-jssdk` from your console
2. Include `dist/napos-jssdk.js` in your HTML, it will exports a global variable named `napos` **OR** use bundle tool like browserify or webpack to `require('napos-jssdk')`.

## 模拟器

SDK提供一个运行环境模拟器用于辅助开发，可以自定义接口的返回值。另外可以模拟例如设置标题、前进、后退等客户端控制接口的效果。

```
git clone https://github.com/eleme/napos-jssdk
cd napos-jssdk
npm install & bower install
gulp
```

`gulp`命令执行成功后，请访问 http://localhost:3000/ 查看模拟器界面。

## 调用方法

获得`napos`句柄之后，可以通过`napos.rpc.invoke`进行RPC调用。

首先进行初始化，如果没有初始化完成其他接口是不能被调用的，用于认证的TOKEN在这一步获取到：
```
napos.initialize('foo.bar.demoApp', function(err, token) {
  if (err) { /** handle error */ }
  
  /**
   * 拿到TOKEN后需发送至你的server端，
   * response后再进行后续操作，确保认证过程已经完成。
   */
});
```

下面是获取用户信息的示例：
```
napos.rpc.invoke('profile.get', {}, function(err, profile) {
  if (err) { /** handle error */ }
  console.log(profile);
});
```