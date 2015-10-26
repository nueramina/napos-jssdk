# API

### napos.initialize(appId, callback)
* **appId** String
* **callback** Function

初始化SDK，并获取TOKEN。

`callback` 执行时传入两个参数 `(err, token)`：

* **err** Object | Null
* **token** String

### napos.rpc.invoke(method, params, callback)
* **method** String
* **params** Object
* **callback** Function 

进行RPC调用，Napos客户端这时相当于服务端。注意params参数为`{ key: value }` 结构。

`callback` 执行时传入两个参数 `(err, result)`：

* **err** Object | Null
* **result** *

## RPC API

通过 `napos.rpc.invoke` 进行调用。

### profile.get()

返回登录用户信息。用户信息结构示例：

```
{
  "userId": "192927",
  "username": "tester_01"
}
```

### restaurant.get()

返回当前餐厅信息。餐厅信息结构示例：

```
{
  "id":"90000001",
  "name":"test_restaurant",
  "imageUrl":"http://baidu.com/logo.png",
  "address":"sdfsdf"
}
```

### view.setTitle(title)
* **title** String

设置标题栏文字

### view.getTitle()

获取标题栏文字

### view.goForward(url)
* **url** String

跳转到某个URL。**由于性能考虑Napos Mobile客户端需要进行跳转时显式调用该方法**。

### view.goBack()

返回到上一个历史URL。**由于性能考虑Napos Mobile客户端需要进行返回时显式调用该方法**。
