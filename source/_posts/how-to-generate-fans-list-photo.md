---
title: 如何生成B站粉丝列表图片
date: 2022-12-10 20:42:22
updated: 2025-07-03 20:51:20
tags:
  - 用户列表
  - 技术
categories:
  - 知识
  - 野生技能协会
---

2022年10月15日，梦春酱的粉丝数回升到2000，于是梦春酱非常开心地发布了[一条动态](https://t.bilibili.com/716979665661591558)，这条动态的其中一张图片里就有TA的所有粉丝的头像与昵称。
那么，我们怎么生成这样子的图片呢？这篇文章就教您如何生成含所有粉丝的列表的图片。

{% note info %}
这篇文章比较适合程序员、技术爱好者阅读，如果您没学过编程也可以按照本文的方法尝试。若您遇到任何问题，可以让梦春酱教您一步步操作。
{% endnote %}
<!-- more -->

## 准备工作

{% note info %}
本文中的代码都是JavaScript代码，所以您应该要预先安装[Node.js](https://nodejs.org/zh-cn)（**建议您下载长期维护版，即LTS版**）。您也可以使用其他编程语言，不过需要对本文中的代码进行一些小改动。
{% endnote %}

以Google Chrome为例：在**登录了B站账号**的浏览器中，打开B站任意页面，打开开发者工具（一般按F12键即可），在工具上方点击“应用”，在左侧点击“存储”部分中“Cookie”左边的箭头，点击下面的B站网址，在右侧表格的“名称”一栏中找到“SESSDATA”与“bili_jct”，分别双击它们右边的“值”，复制下来，这样您就获取到了Cookie。
![获取Cookie](/images/posts/get-cookie.webp)

打开Node.js，您应该会看到一个命令行窗口。在这个窗口里输入代码`const headers = { Cookie: 'SESSDATA=`{% label info@SESSDATA的值 %}`; bili_jct=`{% label primary@bili_jct的值 %}`, Origin: 'https://www.bilibili.com', Referer: 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36' };`，便于在后续操作中使用您账号的登录信息。
例：假如{% label info@SESSDATA的值 %}为`1a2b3c4d%2C1789012345%2C5e6f7*ef`，{% label primary@bili_jct的值 %}为`0123456789abcdef0123456789abcdef`，那么就输入代码：

```js
const headers = { Cookie: 'SESSDATA=1a2b3c4d%2C1789012345%2C5e6f7*ef; bili_jct=0123456789abcdef0123456789abcdef', Origin: 'https://www.bilibili.com', Referer: 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36' }; // 注意：此 Cookie 仅作为示例展示，请修改成自己的 Cookie
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

B站官方给我们提供的获取指定用户的粉丝列表的API是<https://api.bilibili.com/x/relation/fans>，请求方式是GET。
这个API**需要您提供有效的Cookie**，返回的列表按照关注时间的先后顺序**逆向**排序（越晚关注，就在列表的越前面），最多只能获取到**最近关注的1000名粉丝**的信息。
主要的URL参数为：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| vmid | 目标用户UID | 必要 | |
| ps | 每页项数 | 非必要 | 默认为50，且最多为50 |
| pn | 页码 | 非必要 | 默认为1 |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作示例，省略了部分项目）：

```json
{
  "code": 0, // 返回值，0 表示成功，-400 表示请求错误
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
下面是梦春酱写的代码，**记得要在顶层（top level）或者异步（async）函数中运行**，在非异步函数中运行会报错，后面梦春酱写的所有代码也需要在顶层或异步函数中运行。

```js
console.log((await (await fetch('https://api.bilibili.com/x/relation/fans?vmid=425503913&ps=50&pn=1', { headers })).json()).data.list); // 注意：请将 “vmid=” 后面的数字修改成自己的 UID
```

运行上面的代码后，正常情况下控制台会显示一个带有很多元素的数组（array），而且数组的每个元素都是对象（object）。
我们可以在上面代码的基础上稍作修改，来获取多页粉丝列表。如果您设置的每页项数为50，那么您要获取的页数一般为自己的粉丝数除以50，再向上取整（取不小于该数值的最小整数，如2.98→3、3→3、3.02→4）。由于B站的限制，最多只能获取最后关注您的1000个粉丝的列表，所以如果您的粉丝数超过了1000，建议您**只获取前20页粉丝列表**，继续往后获取也是获取不到信息的。

```js
let followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前 20 页粉丝的信息，每页 50 个；这里的页数是根据自己的粉丝数而定的
  followers.push(...(await (await fetch(`https://api.bilibili.com/x/relation/fans?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 注意：请将 “vmid=” 后面的数字修改成自己的 UID
}
```

这样，“followers”变量就存储了最多1000个粉丝的列表。

{% note info %}
出于安全目的，B站采取了一些措施，使用户无法通过常规手段获取到超过1000个粉丝的列表。也就是说，如果您的粉丝数超过了1000，就没有办法直接获取到不在刚刚获取到的粉丝列表里的粉丝了。
当然，如果您在没有超过1000粉丝的时候就保存了自己所有粉丝的列表，那么您可以将之前的列表与现在的列表合并，记得去除重复项。

```js
// 假设 “oldFollowers” 变量为之前存储的所有粉丝信息的数组
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}
```

但是，合并后的列表里的用户现在不一定仍在关注您，所以要移除没有关注您的用户。

获取用户与自己关系的API是<https://api.bilibili.com/x/web-interface/relation>，请求方式是GET。这个API**需要您提供有效的Cookie**。
主要的URL参数为：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| mid | 目标用户的UID | 必要 | |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作示例，省略了部分项目）：

```json
{
  "code": 0, // 返回值，0 表示成功，-400 表示请求错误
  "message": "0", // 错误信息，默认为 0
  // ...
  "data": {
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
```

下面的代码会分别查询自己与每个用户的关系，**可能会执行很长时间**。

```js
const realFollowers = [];
for (const f of followers) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/web-interface/relation?mid=${f.mid}`, { headers })).json();
  if ([1, 2, 6].includes(rjson.data.be_relation.attribute)) realFollowers.push(f); // 如果用户现在正在关注您，可以加入到 “realFollowers” 数组
}

followers = realFollowers;
```

{% endnote %}

## 第二步 获取所有粉丝的详细信息、粉丝数（可选）

{% note info %}
在这个部分中，有一些内容来自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/info.md>与<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/user/status_number.md>。
{% endnote %}

目前“followers”变量虽然存储了所有粉丝的信息，但是这个信息不够详细，比如不包括等级、头像框信息等，我们要想办法获取更详细的粉丝信息。

获取多个用户的详细信息的API是<https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards>，请求方式是GET，这个API调用一次可以获取最多50个用户的信息。
主要的URL参数为：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| uids | 目标用户的UID列表 | 必要 | 每个成员间用英文逗号`,`分割，**最多50个成员** |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作示例，省略了部分项目）：

```json
{
  "code": 0, // 返回值，0 表示成功，-400 表示请求错误，40143 表示批量大小超过限制
  "message": "0", // 错误信息，默认为 0
  // ...
  "data": {
    "12345678": { // 用户 1 的信息
      "mid": "12345678", // 用户 UID
      "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像地址
      "name": "Example", // 用户昵称
      "official": { // 用户认证信息
        "desc": "", // 用户认证备注
        "role": 0, // 用户认证类型
        "title": "", // 用户认证说明文字
        "type": -1 // 用户认证状态，-1 表示未认证，0 表示 UP 主认证，1 表示机构认证
      },
      "vip": { // 用户会员信息
        // ...
        "status": 1, // 用户会员状态，0 表示没有大会员，1 表示有大会员
        // ...
        "type": 1, // 用户会员类型
        // ...
      },
      // ...
    },
    "23456789": { // 用户 2 的信息
      // （数据结构同上）
    },
    // ...
  }
}
```

获取多个用户的关系状态数的API是<https://api.bilibili.com/x/relation/stats>，请求方式是GET。
主要的URL参数为：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| mids | 目标用户UID列表 | 必要 | 每个成员间用英文逗号`,`分割，**最多20个成员** |

如果这个API被正确调用，那么会得到像下面这样的JSON回复（仅作示例，省略了部分项目）：

```json
{
  "code": 0, // 返回值，0 表示成功
  "message": "0", // 错误信息
  // ...
  "data": {
    "12345678": { // 用户 1 的状态数
      "mid": 12345678, // 用户 UID
      "following": 234, // 用户关注数
      // ...
      "follower": 345 // 用户粉丝数
    },
    "23456789": { // 用户 2 的状态数
      // （数据结构同上）
    },
    // ...
  }
}
```

于是我们就可以写出下面的代码：

```js
// 获取所有粉丝的详细信息
const followersWithoutInfo = followers.map(f => f.mid), cjsonList = [];

while (followersWithoutInfo.length) {
  cjsonList.push(fetch(`https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards?uids=${followersWithoutInfo.splice(0, 50).join(',')}`, { headers }).then(resp => resp.json()));
}

for await (const cjson of cjsonList) {
  if (cjson.code === 0) {
    if (cjson.data) {
      for (const [mid, info] of Object.entries(cjson.data)) {
        Object.assign(followers.find(f => f.mid === +mid), info, { mid: +mid });
      }
    }
  }
}

// 获取所有粉丝的粉丝数
const followersWithoutStat = followers.map(f => f.mid), sjsonList = [];

while (followersWithoutStat.length) {
  sjsonList.push(fetch(`https://api.bilibili.com/x/relation/stats?mids=${followersWithoutStat.splice(0, 20).join(',')}`, { headers }).then(resp => resp.json()));
}

for await (const sjson of sjsonList) {
  if (sjson.code === 0) {
    if (sjson.data) {
      for (const [mid, stat] of Object.entries(sjson.data)) {
        Object.assign(followers.find(f => f.mid === +mid), { follower: stat.follower });
      }
    }
  }
}
```

这样，“followers”变量就存储了所有粉丝的信息与粉丝数。

## 第三步 生成图片

我们既然已经获取到了所需要的信息，就应该要生成粉丝列表的图片了。您可以用自己喜欢的方式生成图片。
梦春酱提供了一种生成图片的方法：先生成HTML文件，界面类似于梦春酱的动态里的图片，再在浏览器中截图。

先在Node.js中生成HTML文件：

```js
const encodeHTML = str => typeof str === 'string' ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ (?= )|(?<= ) |^ | $/gm, '&nbsp;').replace(/\r\n|\r|\n/g, '<br />') : '';

// 此处提供了 2 种样式，您可以任选一个样式
// 样式 1：每个粉丝之间换行
const html = followers.map(u => `<div class="info"><div class="image-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.face_nft ? `<img class="face-icon icon-face-nft${[0, 1].includes((u.official || u.official_verify)?.type) || u.vip?.status ? ' second' : ''}" src="https://www.yumeharu.top/images/default-faces%26face-icons/nft.gif" />` : ''}${(u.official || u.official_verify)?.type === 0 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/personal.svg" />' : (u.official || u.official_verify)?.type === 1 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/business.svg" />' : u.vip?.status ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/big-vip.svg" />' : ''}</div> <div><strong>${encodeHTML(u.name || u.uname)}</strong></div></div>`).join('');

// 样式 2：一个粉丝紧跟着另一个粉丝
const html = followers.map(u => `<div class="inline-block"><div class="info"><div class="image-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.face_nft ? `<img class="face-icon icon-face-nft${[0, 1].includes((u.official || u.official_verify)?.type) || u.vip?.status ? ' second' : ''}" src="https://www.yumeharu.top/images/default-faces%26face-icons/nft.gif" />` : ''}${(u.official || u.official_verify)?.type === 0 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/personal.svg" />' : (u.official || u.official_verify)?.type === 1 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/business.svg" />' : u.vip?.status ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/big-vip.svg" />' : ''}</div> <div><strong>${encodeHTML(u.name || u.uname)}</strong></div></div></div>`).join('');

const content = `
<style>
* {
  font-family: Lato, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  overflow-wrap: anywhere;
  text-align: justify;
}
div.inline-block {
  display: inline-block;
  margin-right: 5px;
}
div.info {
  align-items: center;
  display: flex;
}
div.image-wrap {
  margin-right: 5px;
  position: relative;
}
img {
  vertical-align: middle;
}
img.face {
  border-radius: 50%;
  height: 60px;
}
img.icon-face-nft {
  border: 2px solid var(--background-color);
  box-sizing: border-box;
}
div.image-wrap.has-frame img.face {
  height: 51px;
  padding: 19.5px;
}
div.image-wrap.has-frame img.face-frame {
  height: 90px;
  left: calc(50% - 45px);
  position: absolute;
  top: 0;
}
div.image-wrap img.face-icon {
  border-radius: 50%;
  height: 18px;
  left: calc(50% + 13.25px);
  position: absolute;
  top: calc(50% + 13.25px);
}
div.image-wrap img.face-icon.second {
  left: calc(50% - 3.75px);
}
div.image-wrap.has-frame img.face-icon {
  left: calc(50% + 9px);
  top: calc(50% + 9px);
}
div.image-wrap.has-frame img.face-icon.second {
  left: calc(50% - 8px);
}
</style>
${html}`;

fs.writeFileSync('followers.html', content); // 注意：请将 “followers.html” 修改成生成的 HTML 文件的名称
```

再将网页转换成图片：
我们可以在浏览器中打开生成的文件，然后打开开发者工具（一般按F12键即可），点击右上角的三个点展开菜单，选择“运行命令”（也可直接按下Ctrl＋Shift＋P），输入“屏幕截图”，再选择“截取完整尺寸的屏幕截图”，并选择保存图片的位置，就可以保存一张包括所有粉丝的图片了。
![生成图片](/images/posts/take-full-size-screenshot.webp)

## 总结

生成自己的所有粉丝列表的图片看似很难，实际上只有三个步骤，每个步骤不需要您进行太多操作。
下面被折叠的代码就是实现上述功能的完整代码，您可以复制代码并适当修改一下代码，运行脚本，就可以生成您自己的粉丝列表的图片了。

<details>
<summary>点击查看完整代码</summary>
<div class="details">

```js
// 初始化
const headers = { Cookie: 'SESSDATA=1a2b3c4d%2C1789012345%2C5e6f7*ef; bili_jct=0123456789abcdef0123456789abcdef', Origin: 'https://www.bilibili.com', Referer: 'https://www.bilibili.com/', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36' }; // 注意：此 Cookie 仅作为示例展示，请修改成自己的 Cookie

const encodeHTML = str => typeof str === 'string' ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ (?= )|(?<= ) |^ | $/gm, '&nbsp;').replace(/\r\n|\r|\n/g, '<br />') : '';

// 获取自己的 UID
const ujson = await (await fetch('https://api.bilibili.com/x/web-interface/nav', { headers })).json();
const UID = ujson.data.mid;

// 获取可以获取到的粉丝的信息
let followers = []; // 存储粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前 20 页粉丝的信息，每页 50 个；这里的页数是根据自己的粉丝数而定的
  followers.push(...(await (await fetch(`https://api.bilibili.com/x/relation/fans?vmid=${UID}&ps=50&pn=${i}`, { headers })).json()).data.list);
}

/* 如果您之前保存过自己所有粉丝的列表，可以执行以下代码：
// 假设 “oldFollowers” 变量为之前存储的所有粉丝信息的数组
for (const f of oldFollowers) {
  if (!followers.find(t => t.mid === f.mid)) followers.push(f);
}

// 移除没有关注自己的用户（耗时较长）
const realFollowers = [];
for (const f of followers) { // 获取所有在粉丝列表里的用户与自己的关系
  const rjson = await (await fetch(`https://api.bilibili.com/x/web-interface/relation?mid=${f.mid}`, { headers })).json();
  if ([1, 2, 6].includes(rjson.data.be_relation.attribute)) realFollowers.push(f); // 如果用户现在正在关注您，可以加入到 “realFollowers” 数组
}

followers = realFollowers;
*/

// 获取所有粉丝的详细信息
const followersWithoutInfo = followers.map(f => f.mid), jsonList = [];

while (followersWithoutInfo.length) {
  jsonList.push(fetch(`https://api.bilibili.com/x/polymer/pc-electron/v1/user/cards?uids=${followersWithoutInfo.splice(0, 50).join(',')}`, { headers }).then(resp => resp.json()));
}

for await (const cjson of jsonList) {
  if (cjson.code === 0) {
    if (cjson.data) {
      for (const [mid, info] of Object.entries(cjson.data)) {
        Object.assign(followers.find(f => f.mid === +mid), info, { mid: +mid });
      }
    }
  }
}

// 获取所有粉丝的粉丝数
const followersWithoutStat = followers.map(f => f.mid), sjsonList = [];

while (followersWithoutStat.length) {
  sjsonList.push(fetch(`https://api.bilibili.com/x/relation/stats?mids=${followersWithoutStat.splice(0, 20).join(',')}`, { headers }).then(resp => resp.json()));
}

for await (const sjson of sjsonList) {
  if (sjson.code === 0) {
    if (sjson.data) {
      for (const [mid, stat] of Object.entries(sjson.data)) {
        Object.assign(followers.find(f => f.mid === +mid), { follower: stat.follower });
      }
    }
  }
}

// 生成文件，此处提供了 2 种样式，您可以任选一个样式
// 样式 1：每个粉丝之间换行
const html = followers.map(u => `<div class="info"><div class="image-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.face_nft ? `<img class="face-icon icon-face-nft${[0, 1].includes((u.official || u.official_verify)?.type) || u.vip?.status ? ' second' : ''}" src="https://www.yumeharu.top/images/default-faces%26face-icons/nft.gif" />` : ''}${(u.official || u.official_verify)?.type === 0 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/personal.svg" />' : (u.official || u.official_verify)?.type === 1 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/business.svg" />' : u.vip?.status ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/big-vip.svg" />' : ''}</div> <div><strong>${encodeHTML(u.name || u.uname)}</strong></div></div>`).join('');

// 样式 2：一个粉丝紧跟着另一个粉丝
const html = followers.map(u => `<div class="inline-block"><div class="info"><div class="image-wrap${u.pendant?.image ? ' has-frame' : ''}"><img class="face" src="${u.face}" referrerpolicy="no-referrer" />${u.pendant?.pid ? `<img class="face-frame" src="${u.pendant.image_enhance || u.pendant.image}" referrerpolicy="no-referrer" />` : ''}${u.face_nft ? `<img class="face-icon icon-face-nft${[0, 1].includes((u.official || u.official_verify)?.type) || u.vip?.status ? ' second' : ''}" src="https://www.yumeharu.top/images/default-faces%26face-icons/nft.gif" />` : ''}${(u.official || u.official_verify)?.type === 0 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/personal.svg" />' : (u.official || u.official_verify)?.type === 1 ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/business.svg" />' : u.vip?.status ? '<img class="face-icon" src="https://www.yumeharu.top/images/default-faces%26face-icons/big-vip.svg" />' : ''}</div> <div><strong>${encodeHTML(u.name || u.uname)}</strong></div></div></div>`).join('');

const content = `
<style>
* {
  font-family: Lato, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 20px;
  overflow-wrap: anywhere;
  text-align: justify;
}
div.inline-block {
  display: inline-block;
  margin-right: 5px;
}
div.info {
  align-items: center;
  display: flex;
}
div.image-wrap {
  margin-right: 5px;
  position: relative;
}
img {
  vertical-align: middle;
}
img.face {
  border-radius: 50%;
  height: 60px;
}
img.icon-face-nft {
  border: 2px solid var(--background-color);
  box-sizing: border-box;
}
div.image-wrap.has-frame img.face {
  height: 51px;
  padding: 19.5px;
}
div.image-wrap.has-frame img.face-frame {
  height: 90px;
  left: calc(50% - 45px);
  position: absolute;
  top: 0;
}
div.image-wrap img.face-icon {
  border-radius: 50%;
  height: 18px;
  left: calc(50% + 13.25px);
  position: absolute;
  top: calc(50% + 13.25px);
}
div.image-wrap img.face-icon.second {
  left: calc(50% - 3.75px);
}
div.image-wrap.has-frame img.face-icon {
  left: calc(50% + 9px);
  top: calc(50% + 9px);
}
div.image-wrap.has-frame img.face-icon.second {
  left: calc(50% - 8px);
}
</style>
${html}`;

fs.writeFileSync('followers.html', content); // 注意：请将 “followers.html” 修改成生成的 HTML 文件的名称
```

</div>
</details>

下面的图片就是梦春酱在2022年10月15日生成的粉丝列表图片。
![梦春酱在2022年10月15日生成的所有粉丝列表的图片](/images/posts/fans-list.png_compressed.webp)
