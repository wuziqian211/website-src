---
title: 友情链接＆朋友们
date: 2022-10-29 20:11:15
updated: 2022-10-29 20:11:15
---

## 友情链接
{% lg /images/default-faces%26face-icons/akkarin.png %}
朋友圈实验室 | https://aperturelaboratories.icoc.vc/ | 一个古朴的化学实验室 | /images/friendship-links/aperturelaboratories-icoc-vc.png
365云栈 | https://blog.365sites.top/ | 学无止境，勇攀高峰！ | /images/friendship-links/blog-365sites-top.png
Kegongteng | https://kegongteng.cn/ | Blogger / Technophile / Student | /images/friendship-links/kegongteng-cn.jpg
binqlo_ | https://me.onlyra1n.top/ | B站用户“Waxner”的个人网站 | /images/friendship-links/me-onlyra1n-top.png
我汐了_233的小站 | https://woxile.rth1.link/ | B站用户“我汐了_233”的个人网站 | https://api.yumeharu.top/api/getuser?mid=474683920&type=avatar_redirect
知心她们工作室 | https://shuxincm.jzfkw.net/ | 知心她们，心情美好。 | /images/friendship-links/shuxincm-jzfkw-net.png
值关大众放送工作室 | https://zhiguanmedia.jzfkw.net/ | 做有情怀的媒体 | /images/friendship-links/zhiguanmedia-jzfkw-net.png
社凤迷工作室 | https://shefengmi-10.jzfkw.net/ | 看着社会与法 听着凤凰传奇 | /images/friendship-links/shefengmi-10-jzfkw-net.jpg
易姐的博客 | https://shakaianee.top/ | 给岁月以文明，而不是给文明以岁月。 | /images/friendship-links/shakaianee-top.jpeg
GoForceX's Blog | https://goforcex.top/ | A simple blog | /images/friendship-links/goforcex-top.jpg
wuziqian211的网站（旧） | https://wuziqian211.icoc.vc/ | wuziqian211的旧网站，已不再更新 | /images/friendship-links/wuziqian211-icoc-vc.png
{% endlg %}

<details>
<summary>无法访问的友链</summary>
以下友情链接暂时无法访问，wuziqian211期待这些友链的恢复qwq
{% lg /images/default-faces%26face-icons/akkarin.png %}
开心的肥宅快乐水的个人网站 | https://et19798147-2.icoc.vc/ | B站用户“肥宅水水呀”的个人网站 | /images/friendship-links/et19798147-2-icoc-vc.png
{% endlg %}
</details>

如果您也想申请友情链接的话，可以在这个Blog的评论区评论哟awa

### 本站信息
如果您想将本站添加到贵站的友情链接，您可以使用以下信息：
<details>
<summary>点击展开</summary>

| 站点名称 | 站点链接 | 站点图标 | 站点描述 |
| :------: | :------: | :------: | :------: |
| wuziqian211's Blog | <https://wuziqian211.top/> | ![站点图标](/images/icon.png)<https://wuziqian211.top/images/icon.png> | Not for the best, just for the better.<br />或<br />不求最好，只求更好。 |

| 站长昵称 | 站长头像 | 站点截图 |
| :------: | :------: | :------: |
| wuziqian211 | <img class="avatar" alt="站长头像" src="/images/face.png" /><https://wuziqian211.top/images/face.png> | ![站点截图](/images/screenshot.png)<https://wuziqian211.top/images/screenshot.png> |

```yml
# 此 YML 文件仅供参考，您可能需要进行适当修改
  - name: wuziqian211's Blog       # 站点名称
    link: https://wuziqian211.top/ # 站点链接
    icon: https://wuziqian211.top/images/icon.png             # 站点图标
    description: Not for the best, just for the better.       # 站点描述，也可使用 “不求最好，只求更好。”
    author: wuziqian211            # 站长昵称
    avatar: https://wuziqian211.top/images/face.png           # 站长头像
    screenshot: https://wuziqian211.top/images/screenshot.png # 站点截图
```
</details>

## 朋友们
<div class="link-grid" id="friends">正在加载中……</div>
<details id="deleted-friends-wrap" style="display: none;">
<summary>查看已经注销的朋友</summary>

已经注销，但曾经和wuziqian211存在一定关系的朋友有这些：
<div class="link-grid" id="deleted-friends"></div>

这些朋友的注销，给wuziqian211带来了一定程度的损失，wuziqian211非常希望能有缘再见到TA们(´；ω；\`)当然有些朋友已经创建新的账号啦awa
</details>

其实不止上面这些用户，还有很多人在背后默默地支持着wuziqian211呢(=・ω・=)
如果您与wuziqian211的关系很好，但是上面并没有列出您，请在评论区评论或者在B站私信wuziqian211，wuziqian211在这里表示十分抱歉！(´；ω；\`)

<script data-pjax>
const renderUserDiv = info => {
  const userDiv = document.createElement('div');
  userDiv.className = 'link-grid-container';
  const avatar = document.createElement('img');
  avatar.className = 'link-grid-image no-fancybox', avatar.title = info.t, avatar.src = info.a, avatar.referrerPolicy = 'no-referrer';
  userDiv.appendChild(avatar);
  if ([0, 1, 2].includes(info.i)) {
    const faceIcon = document.createElement('img');
    faceIcon.className = 'face-icon no-fancybox', faceIcon.alt = '';
    switch (info.i) {
      case 0:
        faceIcon.title = `UP 主认证：${info.o}`, faceIcon.src = '/images/default-faces%26face-icons/personal.svg';
        break;
      case 1:
        faceIcon.title = `机构认证：${info.o}`, faceIcon.src = '/images/default-faces%26face-icons/business.svg';
        break;
      case 2:
        faceIcon.title = '大会员', faceIcon.src = '/images/default-faces%26face-icons/big-vip.svg';
        break;
    }
    userDiv.appendChild(faceIcon);
  }
  if (info.n) {
    const nftFaceIcon = document.createElement('img');
    nftFaceIcon.className = `face-icon${[0, 1, 2].includes(info.i) ? ' second' : ''} no-fancybox`, nftFaceIcon.alt = '', nftFaceIcon.title = '数字藏品', nftFaceIcon.src = '/images/default-faces%26face-icons/nft-label.gif';
    userDiv.appendChild(nftFaceIcon);
  }
  const title = document.createElement('p');
  title.style.color = info.c || '', title.innerText = info.t;
  userDiv.appendChild(title);
  const desc = document.createElement('p');
  desc.innerText = info.d;
  userDiv.appendChild(desc);
  const link = document.createElement('a');
  link.target = '_blank', link.rel = 'noopener external nofollow noreferrer', link.href = info.l;
  userDiv.appendChild(link);
  return userDiv;
};

(async () => {
  const friends = document.querySelector('div#friends'), deletedFriends = document.querySelector('div#deleted-friends');
  if (!friends) return;
  try {
    const json = await (await fetch('https://api.yumeharu.top/api/modules?id=friends&version=3')).json();
    friends.innerText = '';
    if (json.code === 0) {
      for (const u of json.data.n.sort(() => 0.5 - Math.random())) {
        friends.append(renderUserDiv(u));
      }
      if (deletedFriends) {
        document.querySelector('details#deleted-friends-wrap').style.display = '';
        for (const u of json.data.d.sort(() => 0.5 - Math.random())) {
          deletedFriends.append(renderUserDiv(u));
        }
      }
    }
  } catch {
    friends.innerText = '';
  }
  friends.append(renderUserDiv({ a: '/images/default-faces%26face-icons/akkarin.png', t: '您', d: '是的，就是您 (=・ω・=) 您一直在支持着 wuziqian211，当然也是 wuziqian211 的朋友哟 awa', l: 'https://space.bilibili.com/' }));
})();
</script>
