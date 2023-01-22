---
title: 如何生成B站粉丝列表图片
date: 2022-12-10 20:42:22
updated: 2023-01-22 18:33:30
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
您应该要预先安装[Node.js](https://nodejs.org/zh-cn/)（**建议您下载长期维护版**）。
在**登录了B站账号**的浏览器中，打开B站任意页面，按下F12键，在新窗口上方选择“应用”，在左侧点击“存储”部分中“Cookie”左边的箭头，点击下面的B站网址，在右侧表格的“名称”一栏中找到“SESSDATA”与“bili_jct”，分别双击它们右边的“值”，复制下来。
![获取Cookie](/images/get-cookie.png)
打开Node.js，您应该会看到一个命令行窗口。在这个窗口里输入代码`const headers = { Cookie: 'SESSDATA=`{% label info@SESSDATA的值 %}`; bili_jct=`{% label primary@bili_jct的值 %}`', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' };`，便于在后续操作中使用您账号的登录信息。
例：假如{% label info@SESSDATA的值 %}为`abcdef12%2C1678901234%2C56789*bc`，{% label primary@bili_jct的值 %}为`0123456789abcdef0123456789abcdef`，那么就输入代码：
```js
const headers = { Cookie: 'SESSDATA=abcdef12%2C1678901234%2C56789*bc; bili_jct=0123456789abcdef0123456789abcdef', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' }; // 注意：此Cookie仅作为示例，请修改成自己的Cookie
```
{% note danger %}
**特别注意：请不要把您刚刚复制的“SESSDATA”“bili_jct”中的任何一个值告诉任何人！它们的值是您的账号的登录信息，与账号、密码的作用相似，别人可能会利用这些值来登录您的账号。**
{% endnote %}

## 第一步 获取所有粉丝的列表
{% note info %}
在这个部分中，有一些内容来自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/user/relation.md>。
{% endnote %}
B站官方给我们提供的获取指定用户的粉丝列表的API是<https://api.bilibili.com/x/relation/followers>，请求方式是GET。
这个API需要您提供有效的Cookie，**最多只能获取最近关注您的1000名粉丝的列表**。
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
      "mid": 1, // 用户UID
      "attribute": 6, // 用户关系
      "mtime": 1678901234, // 最近一次改变关系的时间戳
      "tag": [-10], // 关注分组
      "special": 1, // 是否特别关注
      // ...
      "uname": "粉丝1的昵称",
      "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像URL
      "sign": "粉丝1的签名",
      "face_nft": 0, // 是否为数字藏品头像
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
      // （同上）
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
我们可以在上面的代码的基础上稍作修改，来获取前20页的粉丝列表。
```js
let followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前20页粉丝的信息，每页50个
  followers = followers.concat((await (await fetch(`https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 注意：请将“vmid=”后面的数字修改成自己的UID
}
```
这样，“followers”变量就存储了最多1000名粉丝的列表。
那不在这个列表里的粉丝该怎么获取呢？目前，出于安全目的，B站采取了一些措施，使用户无法通过常规手段获取所有粉丝的列表，所以不在刚刚得到的粉丝列表里的粉丝就没办法直接获取到了。
当然，如果您在没有超过1000粉丝的时候就保存了自己所有粉丝的列表，那么您可以将之前的列表与现在的列表合并，记得去除重复项。
```js
// 假设“oldFollowers”变量为之前存储的所有粉丝信息的数组
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}
```
但是，合并后的列表里的粉丝现在不一定仍在关注您，所以要移除没有关注您的用户。下面的代码需要分别查询自己与每个用户的关系，**可能会执行很长时间**。
```js
let realFollowers = [];
for (let i = 0; i < followers.length; i++) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/space/acc/relation?mid=${followers[i].mid}`, { headers })).json();
  if (rjson.data.be_relation.attribute !== 0) realFollowers.push(followers[i]); // 如果用户现在正在关注您，可以加入到“realFollowers”数组
}
```

## 第二步 获取所有粉丝的详细信息、粉丝数（可选）
{% note info %}
在这个部分中，有一些内容来自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/user/info.md>与<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/user/status_number.md>。
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
    "mid": 1, // 用户UID
    "name": "用户1的昵称",
    // ...
    "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像URL
    "sign": "用户1的签名",
    // ...
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
    // ...
    "face_nft": 0, // 是否为数字藏品头像
    "is_senior_member": 0 // 是否为硬核会员
  }, { // 用户2的信息
    // （同上）
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
    "mid": 425503913, // 用户UID
    "following": 2000, // 用户关注数
    // ...
    "follower": 2000 // 用户粉丝数
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
const html = info.map(u => `<span class="face-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.official.type === 0 ? '<img class="face-icon" src="https://api.wuziqian211.top/assets/personal.svg" />' : u.official.type === 1 ? '<img class="face-icon" src="https://api.wuziqian211.top/assets/business.svg" />' : u.vip.status ? '<img class="face-icon" src="https://api.wuziqian211.top/assets/big-vip.svg" />' : ''}</span> ${encodeHTML(u.name)}`).join('<br />\n');
const content = `<style>
* {
  font-family: Lato, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 20px;
  font-weight: bold;
  overflow-wrap: break-word;
  text-align: justify;
  transition: all 0.5s;
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
fs.writeFileSync('followers.html', content); // 注意：请将“followers.html”修改成想生成HTML文件的名称
```
如果您打开这个文件，浏览器显示的是一行一个粉丝。如果我们想让浏览器显示像一个粉丝紧跟着另一个粉丝这样的效果，只需要将上面代码中第2行代码后面的`'<br />\n'`替换成`''`就可以了。
我们如何将整个网页转换成图片呢？我们可以在浏览器中按下F12键，然后按下Ctrl+Shift+P，输入“screenshot”，再选择“截取完整尺寸的屏幕截图”，并选择保存图片的位置，就可以保存一张包括所有粉丝的图片了。
![生成图片](/images/take-full-size-screenshot.png)

## 总结
生成自己的所有粉丝列表的图片看似很难，实际上是很简单的。如果您展开下面的代码，并直接复制，再进行一些适当的修改，也可以生成您自己的粉丝列表的图片。
<details>
<summary>点击查看代码</summary>
```js
// 初始化
const headers = { Cookie: 'SESSDATA=abcdef12%2C1678901234%2C56789*bc; bili_jct=0123456789abcdef0123456789abcdef', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' }; // 注意：此Cookie仅作为示例，请修改成自己的Cookie
const encodeHTML = str => typeof str === 'string' ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ (?= )|(?<= ) |^ | $/gm, '&nbsp;').replace(/\n/g, '<br />') : '';

// 获取可以获取到的粉丝的信息
let followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) {
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
  const rjson = await (await fetch(`https://api.bilibili.com/x/space/acc/relation?mid=${followers[i].mid}`, { headers })).json();
  if (rjson.data.be_relation.attribute !== 0) realFollowers.push(followers[i]); // 如果用户现在正在关注您，可以加入到“realFollowers”数组
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
const html = info.map(u => `<span class="face-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.official.type === 0 ? '<img class="face-icon" src="https://api.wuziqian211.top/assets/personal.svg" />' : u.official.type === 1 ? '<img class="face-icon" src="https://api.wuziqian211.top/assets/business.svg" />' : u.vip.status ? '<img class="face-icon" src="https://api.wuziqian211.top/assets/big-vip.svg" />' : ''}</span> ${encodeHTML(u.name)}`).join('<br />\n');
const content = `<style>
* {
  font-family: Lato, "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 20px;
  font-weight: bold;
  overflow-wrap: break-word;
  text-align: justify;
  transition: all 0.5s;
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
fs.writeFileSync('followers.html', content); // 注意：请将“followers.html”修改成想生成HTML文件的名称
```
</details>

下面的图片，就包含wuziqian211生成的粉丝列表。
![wuziqian211在2022年10月15日生成的所有粉丝列表的图片](/images/fans-list.png)
