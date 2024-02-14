---
title: 友情链接＆朋友们
date: 2022-10-29 20:11:15
updated: 2022-10-29 20:11:15
---

## 友情链接
{% lg /images/you.png %}
朋友圈实验室 | https://aperturelaboratories.icoc.vc/ | 一个古朴的化学实验室 | /images/friendship-links/aperturelaboratories-icoc-vc.png
Winner365のBlog | https://blog.hicosor.top/ | 所谓浮躁，也就是时时刻刻，希望以最短的时间，博取最多的存在感优越感和自我认同。 | /images/friendship-links/blog-hicosor-top.png
Kegongteng | https://kegongteng.cn/ | Blogger / Technophile / Student | /images/friendship-links/kegongteng-cn.jpg
我汐了_233的小站 | https://woxile.rth1.link/ | B站用户“我汐了_233”的个人网站 | /images/friendship-links/woxile-rth1-link.jpg
知心她们工作室 | https://shuxincm.jzfkw.net/ | 知心她们，心情美好。 | /images/friendship-links/shuxincm-jzfkw-net.jpg
易姐的博客 | https://shakaianee.top/ | 给岁月以文明，而不是给文明以岁月。 | /images/friendship-links/shakaianee-top.jpeg
开心的肥宅快乐水的个人网站 | https://et19798147-2.icoc.vc/ | B站用户“肥宅水水呀”的个人网站 | /images/friendship-links/et19798147-2-icoc-vc.png
GoForceX's Blog | https://goforcex.top/ | A simple blog | /images/friendship-links/goforcex-top.jpg
wuziqian211的网站（旧） | https://wuziqian211.icoc.vc/ | wuziqian211的旧网站，已不再更新 | /images/friendship-links/wuziqian211-icoc-vc.png
{% endlg %}
如果您也想申请友情链接的话，可以在这个Blog的评论区评论哟awa

## 朋友们
<div class="link-grid" id="friends">正在加载中……需要大约5秒钟的时间哟QwQ</div>
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
  friends.append(renderUserDiv({ a: '/images/default-faces%26face-icons/you.png', t: '您', d: '是的，就是您 (=・ω・=) 您一直在支持着 wuziqian211，当然也是 wuziqian211 的朋友哟 awa', l: 'https://space.bilibili.com/' }));
})();
</script>
