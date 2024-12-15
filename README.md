## Trx_Svip

波场靓号离线生成工具,包含GPU模式、CPU模式、Web3模式：配置文件修改.env.json中的参数{"mod":""},可以填入gpu4f、cpu4f、web4f,对应三个不同的生成模式

> 本工具仅做技术讨论及交流，请勿将其用于非法用途！

### cpu4f模式(CPU模式)
移植profanity的CPU算法，生成速度依赖与CPU的吞吐能力。

### gpu4f(GPU模式)
移植profanity的GPU算法，用GPU计算出靓号，需要显卡参与，推荐4060以上显卡

### web3(web3模式)
使用波场官方的`tronweb`库的`createAccount` 方法访问，官方波场接口，生成靓号


### 为什么会有这个？

现在市面上的靓号生成服务，基本上都无法放心使用，要么打包成离线软件，要么在背后偷偷上传私钥。举个例子：

- 注意，这是个钓鱼网站 [https://rareaddress.io](https://rareaddress.io)
- 注意，这是个钓鱼网站 [https://viptrx.pro/](https://viptrx.pro/)
- 注意，这是个钓鱼网站 [https://raretrx.pro//](https://raretrx.pro/)
- 注意，这是个钓鱼网站 [https://www.ratetrx.com/](https://www.ratetrx.com/)
- 注意下面这个页面造型的全部是钓鱼网站
<img width="100%" src="https://github.com/aspnmy/vanity-trx/blob/main/screenshot/3.jpg?raw=true"/>
<img width="100%" src="https://github.com/aspnmy/vanity-trx/blob/main/screenshot/4.jpg?raw=true"/>
<img width="100%" src="https://github.com/aspnmy/vanity-trx/blob/main/screenshot/5.jpg?raw=true"/>
上面这个网站，当你在复制私钥的时候，网站会将你复制的私钥加密，然后上传到后台服务：

<img width="100%" src="https://github.com/magical2023/vanity-trx/blob/main/screenshot/1.png?raw=true"/>

缺乏技术知识的人根本无法识别类似服务是否可以满足自己的安全诉求。



说一点题外话：

> 技术上甚至可以做到更隐匿的上传私钥，比如复制私钥的时候，仅做记录，不做网络上传，仅仅在你关闭浏览器的时候再上传。类似这种，就算是有技术知识的人，其实也很难判断，防不胜防。

### 这个呢？

`vanity-trx` 是完全离线的地址生成和靓号检测方案。建议你下载源码，先进行代码审计，然后离线运行该工具。

关于 `tronweb`，请参阅波场官方文档：[https://cn.developers.tron.network/reference/tronweb-object](https://cn.developers.tron.network/reference/tronweb-object)

前端使用了 `webworker` 进行多线程处理，提升靓号生成及匹配速度。

### 如何运行?

- 先下载本仓库源代码
- 电脑安装 `nodejs`，版本 `>=14.16.0`。不会安装的直接百度
- 然后安装依赖：`npm install`
- 运行工具：`npm run dev`
- 浏览器打开：`http://localhost:3000/tool/address`

然后就可以跑起来了，效果如下：

<img width="100%" src="https://github.com/magical2023/vanity-trx/blob/main/screenshot/2.png?raw=true"/>

### 安全说明

#### 1. 依赖的三方包

前端项目运行会依赖于下方贴出的第三方包，详情可参考：`package.json`.

> 这些依赖包均为官方包，有安全顾虑的可直接前往：`https://www.npmjs.com/` 依次查询。

```javascript
"dependencies": {
  "@ant-design/icons": "^4.7.0",
  "antd": "4.23.6",
  "boring-avatars": "^1.7.0",
  "dayjs": "^1.11.6",
  "lodash.map": "^4.6.0",
  "lodash.random": "^3.2.0",
  "next": "latest",
  "nice-color-palettes": "^3.0.0",
  "react": "^18.2.0",
  "react-copy-to-clipboard": "^5.1.0",
  "react-dom": "^18.2.0",
  "zustand": "^4.1.4"
},
"devDependencies": {
  "@trivago/prettier-plugin-sort-imports": "^3.4.0",
  "less": "^4.1.3",
  "less-loader": "^11.1.0",
  "next-with-less": "^2.0.5",
  "prettier": "^2.7.1"
}
```

#### 2. 依赖的 `tronweb.js`

生成账号需要的 `tronweb.js` 位于项目 `public/js/tronweb.js`，做了一个小改动，兼容 `next.js` 的服务端渲染。

如有安全顾虑，可直接使用官方的 `tronweb.js` 与其进行比对。官方 `tronweb.js` 地址为：`https://www.npmjs.com/package/tronweb`.

#### 3. 关于web3网络请求：https://api.shasta.trongrid.io

初始化 `tronweb` 服务，需要指定其：`fullNode` && `solidityNode`。波场官方接口为 https://api.shasta.trongrid.io为官方提供的服务，详情可参考：[https://developers.tron.network/](https://developers.tron.network/)

其中初始化代码为：

```javascript
async function generateAccount() {
  if (tronWeb === null) {
    tronWeb = new TronWeb({
      fullNode: 'https://api.shasta.trongrid.io',
      solidityNode: 'https://api.shasta.trongrid.io',
    });
  }
  return tronWeb.createAccount();
}
```

> 详情可参考：`/public/js/worker.js`


