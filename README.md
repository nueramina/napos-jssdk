# Napos Open JS-SDK

Napos Open JS-SDK 是饿了么商家版为第三方WEB应用开发者提供的开发工具包，通过 JS-SDK 可以获取当前用户信息、餐厅信息等基础信息。

包含第三方网页应用容器模拟环境，方便开发者调试应用。

----------


## Get Started

1. 可以通过以下三种方式获得 JS-SDK:
  - clone & build [this repository](https://github.com/eleme/napos-jssdk)
  - via Bower: by running `$ bower install napos-jssdk` from your console
  - or via npm: by running `$ npm install napos-jssdk` from your console
2. Include `dist/napos-jssdk.js` in your index.html, it will exports a global variable named `napos` **OR** use bundle tool like browserify or webpack to `require('napos-jssdk')`
3. 在命令行执行  `gulp` 会启动一个HTTP服务器，浏览器打开 [http://localhost:3000](http://localhost:3000/) 运行容器模拟器 (可选)

### 验证

出于安全性考虑需要容器与第三方应用验证对方真实性，流程如下：

1. 第三方应用向服务端请求生成签名。
2. 调用 `napos.initialize` 传入服务端返回的 `timestamp`、`nonce`、`signature` 三个参数以及 `appId`。
3. 验证成功后调用 `napos.generateSignature(appId)`，将生成的 `timestamp`、`nonce`、`signature` 传回第三方应用服务端进行验证。

> **签名生成算法**为：将 `token`、`timestamp`、`nonce` 三个参数进行字典序排序，然后拼接成一个字符串进行sha1加密。
>
> 其中 `token` 为 Napos 与第三方应用双方约定好，并始终保存在服务端的凭证，`timestamp` 为时间戳，`nonce` 为随机字符串。
>
>  **验证合法性**需根据对方传来的 `timestamp`、`nonce`，加上己方保存的 `token` 生成签名后与对方传来的签名进行比对，如果相同证明对方可信。




### 示例代码

```
<!doctype html>
<html>
<head>
  ...
</head>
<body>
  ...
  <script src="bower_components/napos-jssdk/dist/napos-jssdk.js"></script>
  <script>
    (function($, napos) {
      /** Constants */
      var APP_ID = 'napos_stats_mobile';

      $.get('/generate-signature', init);

      function init(res) {
        napos.initialize({
          appId: APP_ID,
          nonce: res.nonce,
          timestamp: res.timestamp,
          signature: res.signature
        }, function(err) {
          if (err) {
            console.warn('init err', err);
            return;
          }

          /**
           * Generate signature for application
           * server checking environment
           */
          napos.generateSignature(APP_ID, checkSignature);
        });
      }

      function checkSignature(res) {
        $.post('/check-signature', res, render)
      }

      function render(res) {
        if (res.error) {
          console.warn('signature check failed');
          return;
        }

        console.log('signature check success');
      }
    })(jQuery, napos)
  </script>
</body>
</html>
```

## API

### napos.initialize(options, callback)

 - **options** Object
   - **appId** String
   - **nonce** String
   - **timestamp** String
   - **signature** String
 - **callback** Function

初始化 JS-SDK 并验证 Application 权限。示例：

**服务端（根据TOKEN生成签名）**

`signature` 加密流程：

> 1. 将token、timestamp、nonce三个参数进行字典序排序
> 2. 将三个参数字符串拼接成一个字符串进行sha1加密

```
/** Server side */
var checkArr, checkStr, signature;
var shasum = crypto.createHash('sha1');

var token = 'b43ac';
var nonce = randomString(8);
var timestamp = (new Date()).valueOf().toString();

checkArr = [token, timestamp, nonce].sort();
checkStr = checkArr.join('');

shasum.update(checkStr);
signature = shasum.digest('hex');
```

**浏览器端**
```
/** Browser side */
napos.initialize({
  appId: 'napos_stats_mobile',
  nonce: nonce,
  timestamp: timestamp,
  signature: signature
}, function(err) {
  if (err) {
    ...
    return;
  }

  /** Do something */
  ...

});
```

`callback`在验证完成后执行，传入一个参数：`(err)`。

### napos.generateSignature(appId, callback)

- **appId** String
- **callback** Function

生成指定 Application 签名信息，用于第三方应用验证执行环境。获取到签名信息后在服务器端进行验证，验证成功后再执行第三方应用的初始化过程。示例：

```
napos.generateSignature('napos_stats_mobile', function(err, data) {
  if (err) {
    console.warn(err);
    return;
  }

  console.log(data.nonce, 'Random string');
  console.log(data.timestamp, 'Timestamp');
  console.log(data.signature, 'Signature');

  /** Check signature at server side */
  ...

});
```

`callback` 执行时传入两个参数 `(err, data)`：

 - **err** Object | Null
 - **data** Object
   - **nonce** String
   - **timestamp** String
   - **signature** String

### napos.getRuntime(callback)

获取当前运行环境（PC端、Mobile端）。

`callback` 执行时传入两个参数 `(err, runtime)`：

 - **err** Object | Null
 - **runtime** String

### napos.setTitle(title, callback)

设置窗口左上角标题。

`callback` 执行时传入一个参数 `(err)`。

### napos.getProfile(callback)

获取当前用户信息。

`callback` 执行时传入两个参数 `(err, profile)`：

 - **err** Object | Null
 - **profile** Object
   - **username** String
   - **imageUrl** String
   - **mobile** String

### napos.getAllRestaurant(callback)

获取当前用户所有餐厅信息。

`callback` 执行时传入两个参数 `(err, restaurants)`：

 - **err** Object | Null
 - **restaurants** [Object]
   - **$each**
     - **username** String
     - **imageUrl** String
     - **mobile** String

### napos.getCurrentRestaurant(callback)

获取当前餐厅信息。

`callback` 执行时传入两个参数 `(err, restaurant)`：

 - **err** Object | Null
 - **restaurant** Object
   - **username** String
   - **imageUrl** String
   - **mobile** String

### napos.getStats(date, callback)

 - **date** String (exp `"2015-01-01"`）
 - **callback** Object

获取当前餐厅实时数据。

`callback` 执行时传入两个参数 `(err, data)`：

 - **err** Object | Null
 - **data** Object
   - **online** Number
   - **cash** Number
   - **subsidy** Number
   - **ordersCount** Number


