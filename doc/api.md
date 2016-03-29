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
  "userId": 192927,
  "username": "tester_01"
}
```

### restaurant.getAll()

返回该keeper下所有餐厅列列表：

```
[{
  "id": 1,
  "name": "test_restaurant_01"
}, {
  "id": 2,
  "name": "test_restaurant_02"
}]
```

### restaurant.get()

返回当前餐厅信息。餐厅信息结构示例：

```
{
  "id": 22,
  "name": "test_restaurant",
  "imageUrl": "",
  "address": "sdfsdf",
  "certificationStatus": {
    "businessLicense": {
      "licenseStatus":"passed"
    },
    "serviceLicense": {
      "licenseStatus": "failed"
    }
  },
  "location":{
    "latitude": 31.231765,
    "longitude": 121.380794
  },
  "phones": ["18012341234","18043214321"]
}
```
其中`businessLicense`为营业执照状态,`serviceLicense`为服务许可证状态。

认证状态有以下四种:
* pending 验证中
* passed 验证通过
* failed 验证失败
* unauthenticated 未验证

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

### allcarriers.onUpdate()

通知Napos Mobile客户端更新配送状态。

### file.openChooser()

打开文件选择器，并返回文件名以及内容(Blob)。

```
{
  name: 'foo.png',
  blob: Blob
}
```
