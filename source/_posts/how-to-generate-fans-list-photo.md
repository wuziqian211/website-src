---
title: 如何生成B站粉丝列表图片
date: 2022-12-10 20:42:22
updated: 2024-02-06 22:11:04
tags:
  - 用户列表
  - 技术
categories:
  - 知识
  - 野生技能协会
---

2022年10月15日，由于wuziqian211的粉丝数回升到2000，让wuziqian211非常开心，因此wuziqian211发布了一条动态，这条动态包括一张含所有粉丝的头像和昵称的图片。
那么，我们怎么生成这样子的图片呢？这篇文章就教您如何生成含所有粉丝的列表的图片。
{% note warning %}
**如果您的粉丝数超过了1000，wuziqian211不建议您用下面的方法生成包含所有粉丝的图片。**
这篇文章适合技术爱好者、程序员阅读。若您遇到任何问题，可以让wuziqian211教您一步步操作。
{% endnote %}
<!-- more -->

## 准备工作
{% note info %}
本文中的代码都是JavaScript代码，所以您应该要预先安装[Node.js](https://nodejs.org/)（**建议您下载长期维护版**）。您也可以使用其他编程语言，不过需要对本文中的代码进行一些小改动。
{% endnote %}
以Google Chrome为例：在**登录了B站账号**的浏览器中，打开B站任意页面，打开开发者工具（一般按F12键即可），在工具上方点击“应用”，在左侧点击“存储”部分中“Cookie”左边的箭头，点击下面的B站网址，在右侧表格的“名称”一栏中找到“SESSDATA”与“bili_jct”，分别双击它们右边的“值”，复制下来，这样您就获取到了Cookie。
![获取Cookie](/images/get-cookie.png)
打开Node.js，您应该会看到一个命令行窗口。在这个窗口里输入代码`const headers = { Cookie: 'SESSDATA=`{% label info@SESSDATA的值 %}`; bili_jct=`{% label primary@bili_jct的值 %}`', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' };`，便于在后续操作中使用您账号的登录信息。
例：假如{% label info@SESSDATA的值 %}为`1a2b3c4d%2C1789012345%2C5e6f7*ef`，{% label primary@bili_jct的值 %}为`0123456789abcdef0123456789abcdef`，那么就输入代码：
```js
const headers = { Cookie: 'SESSDATA=1a2b3c4d%2C1789012345%2C5e6f7*ef; bili_jct=0123456789abcdef0123456789abcdef', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }; // 注意：此Cookie仅作为示例，请修改成自己的Cookie
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
**这个API需要您提供有效的Cookie，最多只能获取最近关注您的1000名粉丝的列表**。
主要的URL参数包括：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| vmid | 目标用户UID | 必要 | |
| ps | 每页项数 | 非必要 | 默认为50，且最多为50 |
| pn | 页码 | 非必要 | 默认为1，其他用户仅可查看前5页 |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0表示成功，-400表示请求错误，22007表示访问超过5页
  "message": "0", // 错误信息，默认为“0”
  // ...
  "data": {
    "list": [{ // 粉丝1的信息
      "mid": 12345678, // 用户UID
      "attribute": 6, // 用户关系，0表示您未关注TA，1表示您悄悄关注了TA，6表示TA与您互粉
      "mtime": 1678901234, // 最近一次改变关系的时间戳
      "tag": [-10], // 您的关注分组
      "special": 1, // 您是否特别关注了TA
      "contract_info": { // “老粉计划”相关信息，仅当用户为您的“原始粉丝”或“老粉”才会显示
        "is_contractor": true, // 用户是否为您的“原始粉丝”或“老粉”
        "ts": 1678901234 // 用户成为“原始粉丝”或“老粉”的时间戳
      },
      "uname": "粉丝1的昵称",
      "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像URL
      "sign": "粉丝1的签名",
      "face_nft": 0, // 头像是否为数字藏品头像
      "official_verify": { // 用户认证信息
        "type": -1, // 用户认证状态，-1表示未认证，0表示UP主认证，1表示机构认证
        "desc": "" // 用户认证类型文字
      },
      "vip": { // 用户会员信息
        // ...
        "vipStatus": 1, // 用户会员状态，0表示没有大会员，1表示有大会员
        // ...
      },
      // ...
    }, { // 粉丝2的信息
      // （数据结构同上）
    },
    // ...
    ],
    // ...
    "total": 2000 // 用户粉丝数
  }
}
```
我们就先来尝试获取一下自己粉丝列表的第1页吧。
下面是wuziqian211写的代码，**记得要在顶层或者异步（async）函数中运行**，在非异步函数中运行会报错，后面wuziqian211写的所有代码也需要在顶层或异步函数运行。
```js
(await (await fetch('https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=1', { headers })).json()).data.list; // 注意：请将“vmid=”后面的数字修改成自己的UID
```
运行上面的代码后，正常情况下会显示一个含很多对象（object）的数组（array）。
我们可以在上面的代码的基础上稍作修改，来获取前面几页的粉丝列表。页数一般为自己的粉丝数除以50，再向上取整（即如果您的粉丝数为100，就取页数为2；如果您的粉丝数为101，就取页数为3）；由于B站的限制，最多只能获取前面20页的粉丝列表，所以如果您的粉丝数超过了1000，建议只获取前20页粉丝列表，继续往后获取也获取不到信息。
```js
let followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前20页粉丝的信息，每页50个；这里的页数是根据自己的粉丝数而定的
  followers = followers.concat((await (await fetch(`https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 注意：请将“vmid=”后面的数字修改成自己的UID
}
```
这样，“followers”变量就存储了最多1000名粉丝的列表。
{% note info %}
如果您的粉丝数超过了1000，目前出于安全目的，B站采取了一些措施，使用户无法通过常规手段获取所有粉丝的列表，所以不在刚刚得到的粉丝列表里的粉丝就没办法直接获取到了。
当然，如果您在没有超过1000粉丝的时候就保存了自己所有粉丝的列表，那么您可以将之前的列表与现在的列表合并，记得去除重复项。
```js
// 假设“oldFollowers”变量为之前存储的所有粉丝信息的数组
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}
```
但是，合并后的列表里的粉丝现在不一定仍在关注您，所以要移除没有关注您的用户。下面的代码需要分别查询自己与每个用户的关系，**可能会执行很长时间**。
```js
const crypto = require('node:crypto');
const md5 = data => { // 对数据进行 MD5 加密
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(data, 'utf-8');
  return md5Hash.digest('hex');
};
const encodeWbi = async originalQuery => { // 对请求参数进行 wbi 签名，改编自 https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
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

let realFollowers = [];
for (let i = 0; i < followers.length; i++) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/space/wbi/acc/relation?mid=${await encodeWbi({ mid: followers[i].mid })}`, { headers })).json();
  if ([1, 2, 6].includes(rjson.data.be_relation.attribute)) realFollowers.push(followers[i]); // 如果用户现在正在关注您，可以加入到“realFollowers”数组
}
```
{% endnote %}

## 第二步 获取所有粉丝的详细信息、粉丝数（可选）
{% note info %}
在这个部分中，有一些内容来自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/info.md>与<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/status_number.md>。
{% endnote %}
目前“realFollowers”变量虽然存储了所有粉丝的信息，但是这个信息不够详细。
获取多个用户的详细信息的API是<https://api.vc.bilibili.com/account/v1/user/cards>，请求方式是GET，这个API执行一次可以获取最多50个用户的信息。
主要URL参数包括：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| uids | 目标用户的UID列表 | 必要 | 每个成员间用`,`分隔，最多50个成员 |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0表示成功，-400表示请求错误，600007表示超出批量获取用户信息限制
  "msg": "", // 错误信息，默认为空
  "message": "", // 同上
  "data": [{ // 用户1的信息
    "mid": 12345678, // 用户UID
    "name": "用户1的昵称",
    "sex": "用户1的性别",
    "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像URL
    "sign": "用户1的签名",
    // ...
    "level": 6, // 用户的等级
    "silence": 0, // 用户是否被封禁
    "vip": { // 用户会员信息
      // ...
      "status": 1, // 用户会员状态，0表示没有大会员，1表示有大会员
      // ...
    },
    "pendant": { // 用户头像框信息
      "pid": 0, // 头像框id
      "name": "", // 头像框名称
      "image": "", // 头像框图片URL
      // ...
      "image_enhance": "", // 头像框动态图片URL
      // ...
    },
    // ...
    "official": { // 用户认证信息
      "role": 0, // 用户认证类型
      "title": "", // 用户认证类型文字
      "desc": "", // 用户认证备注
      "type": -1, // 用户认证状态，-1表示未认证，0表示UP主认证，1表示机构认证
    },
    "birthday": 1234540800, // 用户生日时间戳
    // ...
    "is_deleted": 0, // 用户是否已注销
    // ...
    "face_nft": 0, // 头像是否为数字藏品头像
    // ...
    "is_senior_member": 0, // 用户是否为硬核会员
    // ...
  }, { // 用户2的信息
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

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作为示例，一些项已经省略）：
```json
{
  "code": 0, // 返回值，0表示成功
  "message": "0", // 错误信息
  // ...
  "data": {
    "mid": 12345678, // 用户UID
    "following": 234, // 用户关注数
    // ...
    "follower": 345 // 用户粉丝数
  }
}
```
于是我们就可以写出下面的代码：
```js
let followersWithoutInfo = followers.map(f => f.mid); // 没有获取到信息的粉丝UID
let info = [];
while (followersWithoutInfo.length) { // 如果还有没有获取到信息的粉丝，就继续获取信息
  info = info.concat((await (await fetch(`https://api.vc.bilibili.com/account/v1/user/cards?uids=${followersWithoutInfo.slice(0, 50).join(',')}`, { headers })).json()).data);
  followersWithoutInfo = followersWithoutInfo.slice(50);
}
for (let i = 0; i < info.length; i++) { // 获取所有粉丝的粉丝数
  info[i].follower = (await (await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${info[i].mid}`, { headers })).json()).data.follower;
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
fs.writeFileSync('followers.html', content); // 注意：请将“followers.html”修改成生成HTML文件的名称
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
const headers = { Cookie: 'SESSDATA=1a2b3c4d%2C1789012345%2C5e6f7*ef; bili_jct=0123456789abcdef0123456789abcdef', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }; // 注意：此Cookie仅作为示例，请修改成自己的Cookie

const crypto = require('node:crypto');
const md5 = data => { // 对数据进行 MD5 加密
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(data, 'utf-8');
  return md5Hash.digest('hex');
};
const encodeWbi = async originalQuery => { // 对请求参数进行 wbi 签名，改编自 https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
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
let followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前20页粉丝的信息，每页50个；这里的页数是根据自己的粉丝数而定的
  followers = followers.concat((await (await fetch(`https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 注意：请将“vmid=”后面的数字修改成自己的UID
}

/* 如果您之前保存过自己所有粉丝的列表，可以执行以下代码（假设“oldFollowers”变量为之前存储的所有粉丝信息的数组）
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}
*/

// 移除没有关注自己的用户
let realFollowers = [];
for (let i = 0; i < followers.length; i++) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/space/wbi/acc/relation?mid=${await encodeWbi({ mid: followers[i].mid })}`, { headers })).json();
  if ([1, 2, 6].includes(rjson.data.be_relation.attribute)) realFollowers.push(followers[i]); // 如果用户现在正在关注您，可以加入到“realFollowers”数组
}

// 获取所有粉丝的详细信息
let followersWithoutInfo = followers.map(f => f.mid); // 没有获取到信息的粉丝UID
let info = [];
while (followersWithoutInfo.length) { // 如果还有没有获取到信息的粉丝，就继续获取信息
  info = info.concat((await (await fetch(`https://api.vc.bilibili.com/account/v1/user/cards?uids=${followersWithoutInfo.slice(0, 50).join(',')}`, { headers })).json()).data);
  followersWithoutInfo = followersWithoutInfo.slice(50);
}

// 获取所有粉丝的粉丝数
for (let i = 0; i < info.length; i++) {
  info[i].follower = (await (await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${info[i].mid}`, { headers })).json()).data.follower;
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
fs.writeFileSync('followers.html', content); // 注意：请将“followers.html”修改成生成HTML文件的名称
```
</details>

下面的图片就是wuziqian211在2022年10月15日生成的粉丝列表图片。
![wuziqian211在2022年10月15日生成的所有粉丝列表的图片](/images/fans-list.png)
