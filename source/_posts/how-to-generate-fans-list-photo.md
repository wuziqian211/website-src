---
title: 如何生成B站粉丝列表图片
date: 2022-12-10 20:42:22
updated: 2024-02-22 15:46:11
tags:
  - 用户列表
  - 技术
categories:
  - 知识
  - 野生技能协会
---

2022年10月15日，由于wuziqian211的粉丝数回升到2000，让wuziqian211非常开心，因此wuziqian211发布了[一条动态](https://t.bilibili.com/716979665661591558)，这条动态里有一张含有所有粉丝的头像和昵称的图片。
那么，我们怎么生成这样子的图片呢？这篇文章就教您如何生成含所有粉丝的列表的图片。
{% note info %}
这篇文章比较适合程序员、技术爱好者阅读，如果您没学过代码也可以按照本文的方法尝试。若您遇到任何问题，可以让wuziqian211教您一步步操作。
{% endnote %}
<!-- more -->

## 准备工作
{% note info %}
本文中的代码都是JavaScript代码，所以您应该要预先安装[Node.js](https://nodejs.org/)（**建议您下载长期维护版**）。您也可以使用其他编程语言，不过需要对本文中的代码进行一些小改动。
{% endnote %}
以Google Chrome为例：在**登录了B站账号**的浏览器中，打开B站任意页面，打开开发者工具（一般按F12键即可），在工具上方点击“应用”，在左侧点击“存储”部分中“Cookie”左边的箭头，点击下面的B站网址，在右侧表格的“名称”一栏中找到“SESSDATA”与“bili_jct”，分别双击它们右边的“值”，复制下来，这样您就获取到了Cookie。
![获取Cookie](/images/get-cookie.png)
打开Node.js，您应该会看到一个命令行窗口。在这个窗口里输入代码`const headers = { Cookie: 'SESSDATA=`{% label info@SESSDATA的值 %}`; bili_jct=`{% label primary@bili_jct的值 %}`, Origin: 'https://www.bilibili.com', Referer: 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' };`，便于在后续操作中使用您账号的登录信息。
例：假如{% label info@SESSDATA的值 %}为`1a2b3c4d%2C1789012345%2C5e6f7*ef`，{% label primary@bili_jct的值 %}为`0123456789abcdef0123456789abcdef`，那么就输入代码：
```js
const headers = { Cookie: 'SESSDATA=1a2b3c4d%2C1789012345%2C5e6f7*ef; bili_jct=0123456789abcdef0123456789abcdef', Origin: 'https://www.bilibili.com', Referer: 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }; // 注意：此 Cookie 仅作为示例展示，请修改成自己的 Cookie
```
{% note danger %}
**特别注意：请不要把您刚刚复制的“SESSDATA”“bili_jct”中任何一个Cookie的值告诉任何人！它们的值是您的账号的登录信息，与账号、密码的作用相似，别人可能会利用这些值来登录您的账号。**
{% endnote %}
{% note warning %}
目前，B站的Cookie是定期更新的，所以建议您获取完Cookie后暂时不要访问B站的网页，防止原来的Cookie因更新而失效。待您完成所有步骤后，就可以访问B站的网页了。
{% endnote %}

## 第一步 获取所有粉丝的列表
{% note info %}
在这个部分中，有一些内容来自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/relation.md>。
{% endnote %}
B站官方给我们提供的获取指定用户的粉丝列表的API是<https://api.bilibili.com/x/relation/followers>，请求方式是GET。
这个API**需要您提供有效的Cookie**，返回的列表按照关注时间的先后顺序**逆向**排序（越晚关注，就在列表的越前面），最多只能获取到**最近关注的1000名粉丝**的信息。
主要的URL参数包括：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| vmid | 目标用户UID | 必要 | |
| ps | 每页项数 | 非必要 | 默认为50，且最多为50 |
| pn | 页码 | 非必要 | 默认为1 |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例展示，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0 表示成功，-400 表示请求错误，22007 表示访问超过 5 页
  "message": "0", // 错误信息，默认为 “0”
  // ...
  "data": {
    "list": [{ // 粉丝 1 的信息
      "mid": 12345678, // 粉丝 UID
      "attribute": 6, // 该粉丝对于自己的关系，0 表示您未关注 TA，1 表示您悄悄关注了 TA，2 表示您关注了 TA，6 表示您与 TA 互粉，128 表示您拉黑了 TA
      "mtime": 1678901234, // 最近一次改变目标用户对于该粉丝的关系的秒级时间戳
      "tag": [-10], // 该粉丝对于目标用户的关注分组，其中 -10 为特别关注分组；若没有关注或为默认分组，则为 null
      "special": 1, // 目标用户是否特别关注了该粉丝
      "contract_info": { // “老粉计划” 相关信息
        "is_contract": true, // 目标用户是否为该粉丝的 “原始粉丝” 或 “老粉”，仅当为真时才显示此项
        "is_contractor": true, // 粉丝是否为目标用户的 “原始粉丝” 或 “老粉”，仅当为真时才显示此项
        "ts": 1678901234, // 粉丝成为目标用户的 “原始粉丝” 或 “老粉” 的秒级时间戳，仅当 “is_contractor” 项的值为真时才显示此项
        "user_attr": 1 // 粉丝是否为目标用户的 “老粉”，仅当为真时才显示此项
      },
      "uname": "Example", // 粉丝昵称
      "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 粉丝头像地址
      "sign": "个性签名", // 粉丝个性签名
      "face_nft": 0, // 头像是否为数字藏品头像
      "official_verify": { // 用户认证信息
        "type": -1, // 用户认证状态，-1 表示未认证，0 表示 UP 主认证，1 表示机构认证
        "desc": "" // 用户认证说明文字
      },
      "vip": { // 用户会员信息
        // ...
        "vipStatus": 1, // 用户会员状态，0 表示没有大会员，1 表示有大会员
        // ...
      },
      // ...
    }, { // 粉丝 2 的信息
      // （数据结构同上）
    },
    // ...
    ],
    // ...
    "total": 2000 // 目标用户的粉丝数
  }
}
```
我们就先来尝试获取一下自己粉丝列表的第1页吧（每页50个粉丝）。
下面是wuziqian211写的代码，**记得要在顶层（top level）或者异步（async）函数中运行**，在非异步函数中运行会报错，后面wuziqian211写的所有代码也需要在顶层或异步函数中运行。
```js
console.log((await (await fetch('https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=1', { headers })).json()).data.list); // 注意：请将 “vmid=” 后面的数字修改成自己的 UID
```
运行上面的代码后，正常情况下控制台会显示一个带有很多元素的数组（array），而且数组的每个元素都是对象（object）。
我们可以在上面代码的基础上稍作修改，来获取多页粉丝列表。如果您设置的每页项数为50，那么您要获取的页数一般为自己的粉丝数除以50，再向上取整（取不小于该数值的最小整数，如2.98→3、3→3、3.02→4）。由于B站的限制，最多只能获取最后关注您的1000个粉丝的列表，所以如果您的粉丝数超过了1000，建议**只获取前20页粉丝列表**，继续往后获取也是获取不到信息的。
```js
const followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前 20 页粉丝的信息，每页 50 个；这里的页数是根据自己的粉丝数而定的
  followers.push(...(await (await fetch(`https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 注意：请将 “vmid=” 后面的数字修改成自己的 UID
}
```
这样，“followers”变量就存储了最多1000个粉丝的列表。
{% note info %}
如果您的粉丝数超过了1000，目前出于安全目的，B站采取了一些措施，使用户无法通过常规手段获取所有粉丝的列表，所以不在刚刚得到的粉丝列表里的粉丝就没办法直接获取到了。
当然，如果您在没有超过1000粉丝的时候就保存了自己所有粉丝的列表，那么您可以将之前的列表与现在的列表合并，记得去除重复项。
```js
// 假设 “oldFollowers” 变量为之前存储的所有粉丝信息的数组
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}
```
但是，合并后的列表里的用户现在不一定仍在关注您，所以要移除没有关注您的用户。

获取用户与自己关系的API是<https://api.bilibili.com/x/space/wbi/acc/relation>，请求方式是GET。
本API需要使用Wbi签名来鉴权，详见<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md>。下面的代码已经实现了Wbi鉴权。
主要URL参数包括：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| mid | 目标用户的UID | 必要 | |
| wts | 当前时间戳 | 必要 | 见<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md> |
| w_rid | Wbi签名 | 必要 | 见<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md> |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例展示，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0 表示成功，-400 表示请求错误
  "message": "0", // 错误信息，默认为 0
  // ...
  "data": {
    {
      "relation": { // 该用户对于自己的关系
        "mid": 12345678, // 该用户的 UID
        "attribute": 6, // 该用户对于自己的关系代码，0 表示您未关注 TA，1 表示您悄悄关注了 TA，2 表示您关注了 TA，6 表示您与 TA 互粉，128 表示您拉黑了 TA
        "mtime": 1678901234, // 最近一次改变用户对于自己的关系的秒级时间戳；若自己没有关注用户，则为 0
        "tag": [-10], // 用户对于自己的关注分组，其中 -10 为特别关注分组；若没有关注或为默认分组，则为 null
        "special": 1 // 自己是否特别关注了用户
      },
      "be_relation": { // 自己对于该用户的关系
        "mid": 425503913, // 自己的 UID
        "attribute": 6, // 自己对于该用户的关系代码
        "mtime": 1612345678, // 最近一次改变自己对于该用户的关系的秒级时间戳；若用户没有关注自己，则为 0
        "tag": [123456], // 自己对于该用户的关注分组
        "special": 0 // 用户是否特别关注了自己
      }
    }
  }
}
```
下面的代码会分别查询自己与每个用户的关系，**可能会执行很长时间**。
```js
const crypto = require('node:crypto');
const md5 = data => { // 对数据进行 MD5 加密
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(data, 'utf-8');
  return md5Hash.digest('hex');
};
const encodeWbi = async originalQuery => { // 对请求参数进行 Wbi 签名，改编自 https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
  const ujson = await (await fetch('https://api.bilibili.com/x/web-interface/nav', { headers })).json();
  const imgKey = ujson.data.wbi_img.img_url.replace(/^(?:.*\/)?([^\.]+)(?:\..*)?$/, '$1'),
    subKey = ujson.data.wbi_img.sub_url.replace(/^(?:.*\/)?([^\.]+)(?:\..*)?$/, '$1');
  let t = '';
  [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52].forEach(n => t += (imgKey + subKey)[n]);
  const mixinKey = t.slice(0, 32), query = { ...originalQuery, wts: Math.floor(await Date.now() / 1000) }; // 对 imgKey 和 subKey 进行字符顺序打乱编码，添加 wts 字段
  const params = new URLSearchParams(Object.keys(query).sort().map(name => [name, query[name].toString().replace(/[!'()*]/g, '')])); // 按照 key 重排参数，过滤 value 中的 “!”“'”“(”“)”“*” 字符
  params.append('w_rid', md5(params + mixinKey)); // 计算 w_rid
  return params;
};

const realFollowers = [];
for (const f of followers) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/space/wbi/acc/relation?mid=${await encodeWbi({ mid: f.mid })}`, { headers })).json();
  if ([1, 2, 6].includes(rjson.data.be_relation.attribute)) realFollowers.push(f); // 如果用户现在正在关注您，可以加入到 “realFollowers” 数组
}
```
{% endnote %}

## 第二步 获取所有粉丝的详细信息、粉丝数
{% note info %}
在这个部分中，有一些内容来自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/info.md>与<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/status_number.md>。
{% endnote %}
目前“realFollowers”变量虽然存储了所有粉丝的信息，但是这个信息不够详细，我们要想办法获取更详细的粉丝信息。
获取多个用户的详细信息的API是<https://api.vc.bilibili.com/account/v1/user/cards>，请求方式是GET，这个API执行一次可以获取最多50个用户的信息。
主要URL参数包括：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| uids | 目标用户的UID列表 | 必要 | 每个成员间用`,`分隔，最多50个成员 |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例展示，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0 表示成功，-400 表示请求错误，600007 表示超出批量获取用户信息限制
  "msg": "", // 错误信息，默认为空
  "message": "", // 同上
  "data": [{ // 用户 1 的信息
    "mid": 12345678, // 用户 UID
    "name": "Example", // 用户昵称
    "sex": "保密", // 用户性别
    "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像地址
    "sign": "个性签名", // 用户个性签名
    // ...
    "level": 6, // 用户等级
    "silence": 0, // 用户是否被封禁
    "vip": { // 用户会员信息
      // ...
      "status": 1, // 用户会员状态，0 表示没有大会员，1 表示有大会员
      // ...
    },
    "pendant": { // 用户头像框信息
      "pid": 0, // 头像框 ID
      "name": "", // 头像框名称
      "image": "", // 头像框图片地址
      // ...
      "image_enhance": "", // 头像框动态图片地址
      // ...
    },
    // ...
    "official": { // 用户认证信息
      "role": 0, // 用户认证类型
      "title": "", // 用户认证说明文字
      "desc": "", // 用户认证备注
      "type": -1, // 用户认证状态，-1 表示未认证，0 表示 UP 主认证，1 表示机构认证
    },
    "birthday": 1234540800, // 用户生日时间戳
    // ...
    "is_deleted": 0, // 用户是否已注销
    // ...
    "face_nft": 0, // 头像是否为数字藏品头像
    // ...
    "is_senior_member": 0, // 用户是否为硬核会员
    // ...
  }, { // 用户 2 的信息
    // （数据结构同上）
  },
  // ...
  ]
}
```
获取用户关系状态数的API是<https://api.bilibili.com/x/relation/stat>，请求方式是GET。
主要URL参数包括：

| 参数名 | 内容 | 必要性 |
| :----: | :--: | :----: |
| vmid | 目标用户UID | 必要 |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例展示，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0 表示成功
  "message": "0", // 错误信息
  // ...
  "data": {
    "mid": 12345678, // 用户 UID
    "following": 234, // 用户关注数
    // ...
    "follower": 345 // 用户粉丝数
  }
}
```
于是我们就可以写出下面的代码：
```js
const followersWithoutInfo = followers.map(f => f.mid), // 没有获取到信息的粉丝 UID
  jsonList = []; // 获取到的 JSON
while (followersWithoutInfo.length) { // 如果还有没有获取到信息的粉丝，就继续获取信息
  jsonList.push(fetch(`https://api.vc.bilibili.com/account/v1/user/cards?uids=${followersWithoutInfo.slice(0, 50).join(',')}`, { headers }).then(resp => resp.json())); // 每次获取 50 个
  followersWithoutInfo.splice(0, 50);
}
const info = (await Promise.all(jsonList)).filter(ujson => ujson.code === 0).map(ujson => ujson.data).flat();
for (const i of info) { // 获取所有粉丝的粉丝数
  i.follower = (await (await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${i.mid}`, { headers })).json()).data.follower;
}
```
这样，“info”变量就存储了所有粉丝的信息与粉丝数。

## 第三步 生成图片
我们可以根据自己的喜好，选择生成什么类型的文件。下面的代码可以生成HTML文件，界面类似于wuziqian211的动态里的图片。
```js
const encodeHTML = str => typeof str === 'string' ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ (?= )|(?<= ) |^ | $/gm, '&nbsp;').replace(/\n/g, '<br />') : '';
const html = info.map(u => `<span class="face-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.official.type === 0 ? '<img class="face-icon" src="https://wuziqian211.top/images/default-faces%26face-icons/personal.svg" />' : u.official.type === 1 ? '<img class="face-icon" src="https://wuziqian211.top/images/default-faces%26face-icons/business.svg" />' : u.vip.status ? '<img class="face-icon" src="https://wuziqian211.top/images/default-faces%26face-icons/big-vip.svg" />' : ''}</span> ${encodeHTML(u.name)}`).join('<br />\n');
const content = `<style>
* {
  font-family: Lato, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: bold;
  overflow-wrap: break-word;
  text-align: justify;
}
span.face-wrap {
  display: inline-block;
  position: relative;
}
img {
  vertical-align: middle;
}
img.face {
  border-radius: 50%;
  height: 60px;
}
span.face-wrap.has-frame img.face {
  height: 51px;
  padding: 19.5px;
}
span.face-wrap.has-frame img.face-frame {
  height: 90px;
  left: 0;
  position: absolute;
  top: 0;
}
span.face-wrap img.face-icon {
  bottom: 0;
  height: 18px;
  position: absolute;
  right: 0;
}
span.face-wrap.has-frame img.face-icon {
  bottom: 18px;
  right: 18px;
}
</style>
${html}`;
fs.writeFileSync('followers.html', content); // 注意：请将 “followers.html” 修改成生成的 HTML 文件的名称
```
如果您打开这个文件，浏览器显示的是一行一个粉丝。如果我们想让浏览器显示像一个粉丝紧跟着另一个粉丝这样的效果，只需要将上面代码中第2行代码后面的`'<br />\n'`替换成`''`就可以了。
我们如何将整个网页转换成图片呢？我们可以在浏览器中打开开发者工具（一般按F12键即可），然后点击右上角的三个点展开菜单，选择“运行命令”（也可直接按下Ctrl+Shift+P），输入“屏幕截图”，再选择“截取完整尺寸的屏幕截图”，并选择保存图片的位置，就可以保存一张包括所有粉丝的图片了。
![生成图片](/images/take-full-size-screenshot.png)

## 总结
生成自己的所有粉丝列表的图片看似很难，实际上只有三个步骤，每个步骤不需要您进行太多操作。
下面被折叠的代码就是实现上述功能的完整代码，您可以直接复制代码，再适当修改一下代码，就可以生成您自己的粉丝列表的图片了。
<details>
<summary>点击查看完整代码</summary>
```js
// 初始化
const headers = { Cookie: 'SESSDATA=1a2b3c4d%2C1789012345%2C5e6f7*ef; bili_jct=0123456789abcdef0123456789abcdef', Origin: 'https://www.bilibili.com', Referer: 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }; // 注意：此 Cookie 仅作为示例展示，请修改成自己的 Cookie

const crypto = require('node:crypto');
const md5 = data => { // 对数据进行 MD5 加密
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(data, 'utf-8');
  return md5Hash.digest('hex');
};
const encodeWbi = async originalQuery => { // 对请求参数进行 Wbi 签名，改编自 https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
  const ujson = await (await fetch('https://api.bilibili.com/x/web-interface/nav', { headers })).json();
  const imgKey = ujson.data.wbi_img.img_url.replace(/^(?:.*\/)?([^\.]+)(?:\..*)?$/, '$1'),
    subKey = ujson.data.wbi_img.sub_url.replace(/^(?:.*\/)?([^\.]+)(?:\..*)?$/, '$1');
  let t = '';
  [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52].forEach(n => t += (imgKey + subKey)[n]);
  const mixinKey = t.slice(0, 32), query = { ...originalQuery, wts: Math.floor(await Date.now() / 1000) }; // 对 imgKey 和 subKey 进行字符顺序打乱编码，添加 wts 字段
  const params = new URLSearchParams(Object.keys(query).sort().map(name => [name, query[name].toString().replace(/[!'()*]/g, '')])); // 按照 key 重排参数，过滤 value 中的 “!”“'”“(”“)”“*” 字符
  params.append('w_rid', md5(params + mixinKey)); // 计算 w_rid
  return params;
};
const encodeHTML = str => typeof str === 'string' ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ (?= )|(?<= ) |^ | $/gm, '&nbsp;').replace(/\n/g, '<br />') : '';

// 获取可以获取到的粉丝的信息
const followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前 20 页粉丝的信息，每页 50 个；这里的页数是根据自己的粉丝数而定的
  followers.push(...(await (await fetch(`https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 注意：请将 “vmid=” 后面的数字修改成自己的 UID
}

/* 如果您之前保存过自己所有粉丝的列表，可以执行以下代码：
// 假设 “oldFollowers” 变量为之前存储的所有粉丝信息的数组
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}

// 移除没有关注自己的用户（耗时较长）
const realFollowers = [];
for (const f of followers) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/space/wbi/acc/relation?mid=${await encodeWbi({ mid: f.mid })}`, { headers })).json();
  if ([1, 2, 6].includes(rjson.data.be_relation.attribute)) realFollowers.push(f); // 如果用户现在正在关注您，可以加入到 “realFollowers” 数组
}

// 同时，请将下面代码中的 “followers” 改成 “realFollowers”
*/

// 获取所有粉丝的详细信息
const followersWithoutInfo = followers.map(f => f.mid), // 没有获取到信息的粉丝 UID
  jsonList = []; // 获取到的 JSON
while (followersWithoutInfo.length) { // 如果还有没有获取到信息的粉丝，就继续获取信息
  jsonList.push(fetch(`https://api.vc.bilibili.com/account/v1/user/cards?uids=${followersWithoutInfo.slice(0, 50).join(',')}`, { headers }).then(resp => resp.json())); // 每次获取 50 个
  followersWithoutInfo.splice(0, 50);
}
const info = (await Promise.all(jsonList)).filter(ujson => ujson.code === 0).map(ujson => ujson.data).flat();

// 获取所有粉丝的粉丝数
for (const i of info) {
  i.follower = (await (await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${i.mid}`, { headers })).json()).data.follower;
}

// 生成文件
const html = info.map(u => `<span class="face-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.official.type === 0 ? '<img class="face-icon" src="https://wuziqian211.top/images/default-faces%26face-icons/personal.svg" />' : u.official.type === 1 ? '<img class="face-icon" src="https://wuziqian211.top/images/default-faces%26face-icons/business.svg" />' : u.vip.status ? '<img class="face-icon" src="https://wuziqian211.top/images/default-faces%26face-icons/big-vip.svg" />' : ''}</span> ${encodeHTML(u.name)}`).join('<br />\n');
const content = `<style>
* {
  font-family: Lato, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  font-weight: bold;
  overflow-wrap: break-word;
  text-align: justify;
}
span.face-wrap {
  display: inline-block;
  position: relative;
}
img {
  vertical-align: middle;
}
img.face {
  border-radius: 50%;
  height: 60px;
}
span.face-wrap.has-frame img.face {
  height: 51px;
  padding: 19.5px;
}
span.face-wrap.has-frame img.face-frame {
  height: 90px;
  left: 0;
  position: absolute;
  top: 0;
}
span.face-wrap img.face-icon {
  bottom: 0;
  height: 18px;
  position: absolute;
  right: 0;
}
span.face-wrap.has-frame img.face-icon {
  bottom: 18px;
  right: 18px;
}
</style>
${html}`;
fs.writeFileSync('followers.html', content); // 注意：请将 “followers.html” 修改成生成的 HTML 文件的名称
```
</details>

下面的图片就是wuziqian211在2022年10月15日生成的粉丝列表图片。
![wuziqian211在2022年10月15日生成的所有粉丝列表的图片](/images/fans-list.png)
