---
title: 如何生成B站粉丝列表图片
date: 2022-12-10 20:42:22
updated: 2022-12-11 15:39:15
description: 这篇文章可能需要您有一定的编程能力，看不懂的就关掉吧
tags:
  - 粉丝
  - 技术
categories:
  - 知识
  - 野生技能协会
---
2022年10月15日，wuziqian211的粉丝数回升到2000，同时wuziqian211发布了一条动态，里面包含一张图片，上面写着“wuziqian211所有粉丝”，下面就是许多用户的头像和昵称。
那么，我们怎么生成像这样的图片呢？
大体来说，可以分成这样几步：

1. 获取所有粉丝的UID
2. 根据UID获取所有粉丝的信息
3. 生成HTML文件
4. 渲染页面，生成图片

{% note warning %}
这篇文章需要您掌握HTML、CSS与JavaScript的基础知识，如果您看不懂这篇文章建议您放弃。
**这篇文章刚发布，可能会存在许多错误。**
若您遇到任何问题，可以跟wuziqian211说明。
{% endnote %}
<!-- more -->

## 准备工作
您应该要准备[Node.js](https://nodejs.org/zh-cn/)，若您没有准备，请您下载，建议您下载长期维护版。
在**登录了B站账号**的浏览器中，打开B站任意页面，按下F12键，在新窗口上方选择“应用”，在左侧点击“存储”部分中“Cookie”左边的箭头，点击下面的B站网址，在右侧表格的“名称”一栏中找到“SESSDATA”与“bili_jct”，分别双击它们右边的“值”，复制下来。
![获取Cookie](/images/get-cookie.png)
打开Node.js，您应该会看到一个命令行窗口。在这个窗口里输入代码`const headers = { Cookie: 'SESSDATA=`{% label info@SESSDATA的值 %}`; bili_jct=`{% label primary@bili_jct的值 %}`', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' };`，便于在后续操作中使用您账号的登录信息。
例：假如{% label info@SESSDATA的值 %}为`abcdef12%2C1678901234%2C56789*bc`，{% label primary@bili_jct的值 %}为`0123456789abcdef0123456789abcdef`，那么就输入代码：
```js
const headers = { Cookie: 'SESSDATA=abcdef12%2C1678901234%2C56789*bc; bili_jct=0123456789abcdef0123456789abcdef', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36' }; // Cookie仅作为示例，请修改
```
{% note danger %}
**特别注意：请不要把您刚刚复制的“SESSDATA”“bili_jct”中的任何一个值告诉任何人！它们的值是您的账号的登录信息，与账号、密码的作用相似，别人可能会利用这些值来登录您的账号。**
{% endnote %}

## 第一步：获取所有粉丝的UID
{% note info %}
本部分中，部分内容选自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/user/relation.md>。
{% endnote %}
B站官方获取指定用户的粉丝列表的API是<https://api.bilibili.com/x/relation/followers>，请求方式是GET，**需要有效的Cookie才能获取自己的最多1000名粉丝的列表，是的，只能获取最近关注您的1000名粉丝**。
主要URL参数包括：

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
  "ttl": 1,
  "data": {
    "list": [{ // 粉丝1的信息
      "mid": 1, // 用户UID
      "attribute": 6, // 用户关系
      "mtime": 1678901234, // 最近一次改变关系的时间戳
      "tag": [-10], // 关注分组
      "special": 1, // 是否特别关注
      "uname": "粉丝1的昵称",
      "face": "https://i0.hdslb.com/bfs/face/xxx.jpg", // 用户头像URL
      "sign": "粉丝1的签名",
      "official_verify": { // 用户认证信息
        "type": -1, // 用户认证状态，-1表示未认证，0表示UP主认证，1表示机构认证
        "desc": "" // 用户认证类型文字
      },
      "vip": { // 用户会员信息
        // ...
        "vipStatus": 1, // 用户会员状态，0表示没有大会员，1表示有大会员
        // ...
      }
    }, { // 粉丝2的信息
      // （同上）
    },
    // ...
    ],
    "re_version": 3210987654,
    "total": 2000 // 用户粉丝数
  }
}
```
我们就根据上面的“API说明”写代码，先来尝试获取自己粉丝列表的第1页吧。
下面是wuziqian211写的代码，记得要在顶层或异步函数中运行，在非异步函数中运行会报错，后面的所有代码也一样。
```js
(await (await fetch('https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=1', { headers })).json()).data.list; // 请将“vmid=”后面的数字修改成自己的UID
```
运行上面的代码后，正常情况下会显示一个含很多对象的数组。我们可以在上面的代码的基础上稍作修改，来获取前20页的粉丝列表。
```js
let followers = []; // 粉丝列表
for (let i = 1; i <= 20; i++) { // 获取前20页粉丝的信息，每页50个
  followers = followers.concat((await (await fetch(`https://api.bilibili.com/x/relation/followers?vmid=425503913&ps=50&pn=${i}`, { headers })).json()).data.list); // 请将“vmid=”后面的数字修改成自己的UID
}
```
这样，“followers”变量就存储了包含最多1000位粉丝的列表。
那不在这个列表里的粉丝，怎么获取呢？目前B站为了反爬虫，无法通过常规手段直接把所有粉丝的列表提供给用户。所以不在列表里的粉丝就没办法获取到了。
wuziqian211是这样“解决”的，wuziqian211找到了在TA以前保存的所有粉丝的UID的列表（是的，以前B站有接口可以获取所有粉丝列表，<https://member.bilibili.com/x/h5/data/fan/list>，但是现在已经无法使用了，可惜），不妨存储在一个变量，就叫“oldFollowers”吧。于是将以前的列表与现在的列表合并起来就“得到”了“wuziqian211的所有粉丝列表”。当然，也不能直接合并，因为以前的列表只包含UID，现在的列表包含用户信息，所以要让现在的列表只包含UID。
```js
followers = followers.map(f => f.mid);
```
然后就可以合并列表了，记得去除重复项。
```js
for (const f of oldFollowers) {
  if (!followers.includes(f)) followers.push(f);
}
```
当然，这个列表包含以前关注过wuziqian211，现在取消关注了的用户。我们可以查询自己与每个用户的关系，来移除现在没有关注自己的用户。当然wuziqian211因为懒，就没有这样做。感兴趣的可以尝试一下。

## 第二步：根据UID获取所有粉丝的信息
{% note info %}
本部分中，部分内容选自<https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/user/info.md>。
{% endnote %}
我们得到的列表只有UID，所以要获取所有粉丝的信息。
我们找到了这个API，一次可以获取最多50个用户的信息，<https://api.vc.bilibili.com/account/v1/user/cards>，请求方式是GET。
主要URL参数包括：

| 参数名 | 内容 | 必要性 | 备注 |
| :----: | :--: | :----: | ---- |
| uids | 目标用户的mid列表 | 必要 | 每个成员间用`,`分隔，最多50个成员 |

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
      "expire": 0,
      "image_enhance": "", // 头像框动态图片URL
      "image_enhance_frame": ""
    },
    // ...
    "official": { // 用户认证信息
      "role": 0, // 用户认证类型
      "title": "", // 用户认证类型文字
      "desc": "", // 用户认证备注
      "type": -1, // 用户认证状态，-1表示未认证，0表示UP主认证，1表示机构认证
    },
    // ...
  }, { // 用户2的信息
    // （同上）
  },
  // ...
  ]
}
```
于是我们就可以写出下面的代码：
```js
let followersWithoutInfo = [...followers]; // 没有获取到信息的粉丝UID（深拷贝“followers”变量）
let info = [];
while (followersWithoutInfo.length) { // 如果还有没有获取到信息的粉丝，就继续获取信息
  info = info.concat((await (await fetch(`https://api.vc.bilibili.com/account/v1/user/cards?uids=${followersWithoutInfo.slice(0, 50).join(',')}`, { headers })).json()).data);
  followersWithoutInfo = followersWithoutInfo.slice(50);
}
```
这样“info”变量就存储了所有粉丝的信息。

## 第三步：生成HTML文件
套用<https://github.com/wuziqian211/website-api/blob/main/api/getuser.js>中显示用户信息的方式。
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
fs.writeFileSync('followers.html', content); // 请将“followers.html”修改成想生成HTML文件的名称
```
我们就可以得到一个HTML文件，打开这个文件，应该就可以看到粉丝们的信息了。
当然，这里面是一行一个粉丝，而不是一个粉丝紧接着另一个粉丝。只需要把上面代码中第2行代码后面的`<br />\n`删掉就可以了。

## 第四步：渲染页面，生成图片
页面是有了，我们怎么生成图片呢？
在浏览器中按下F12键，然后按下Ctrl+Shift+P，输入“screenshot”，然后选择“截取完整尺寸的屏幕截图”，再选择保存图片的位置，就可以保存一张包括所有粉丝的图片了。
![生成图片](/images/take-full-size-screenshot.png)

## 总结
如果您的粉丝数在1000以上，我不建议你用上面的方法生成包含所有粉丝的图片，因为B站的API目前只能把最后关注您的1000位粉丝提供给您，您很早以前的粉丝获取不到。
当然，如果您只想生成最近关注您的粉丝列表还是可以这样做的。
下面就是wuziqian211生成的粉丝列表。
![wuziqian211在2022年10月15日的粉丝列表](/images/fans-list.png)
