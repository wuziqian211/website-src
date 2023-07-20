---
title: 友情链接＆朋友们
date: 2022-10-29 20:11:15
updated: 2022-10-29 20:11:15
---
## 友情链接
{% lg %}
朋友圈实验室 | https://aperturelaboratories.icoc.vc/ | 一个古朴的化学实验室 | /images/aperturelaboratories-icoc-vc.png
Winner365のBlog | https://blog.hicosor.top/ | 所谓浮躁，也就是时时刻刻，希望以最短的时间，博取最多的存在感优越感和自我认同。 | /images/blog-hicosor-top.png
易姐的博客 | https://shakaianee.top/ | 给岁月以文明，而不是给文明以岁月。 | /images/shakaianee-top.jpeg
开心的肥宅快乐水的个人网站 | https://et19798147-2.icoc.vc/ | B站用户“肥宅水水呀”的个人网站 | /images/et19798147-2-icoc-vc.png
wuziqian211的网站（旧） | https://wuziqian211.icoc.vc/ | wuziqian211的旧网站，已不再更新 | /images/wuziqian211-icoc-vc.png
{% endlg %}
如果您也想申请友情链接的话，可以在这个Blog的评论区评论哟awa

## 朋友们
<div class="link-grid" id="friends">正在加载中……需要大约5秒钟的时间哟qwq</div>

其实不止上面这些用户，还有很多人在背后默默地支持着wuziqian211呢(=・ω・=)
如果您与wuziqian211的关系很好，但是上面并没有列出您，请在评论区评论或者在B站私信wuziqian211，wuziqian211在这里表示十分抱歉！(´；ω；\`)

<script data-pjax>
(async () => {
  const friends = document.querySelector('div#friends');
  if (!friends) return;
  const json = await (await fetch('https://api.yumeharu.top/api/modules?id=friends&version=2')).json();
  if (json.code === 0) {
    friends.innerText = '';
    for (const u of json.data.sort(() => 0.5 - Math.random())) {
      const userDiv = document.createElement('div');
      userDiv.className = 'link-grid-container';
      const avatar = document.createElement('img');
      avatar.className = 'link-grid-image nofancybox';
      avatar.title = u.title;
      avatar.src = u.image;
      avatar.referrerPolicy = 'no-referrer';
      userDiv.appendChild(avatar);
      if (u.icon) {
        const faceIcon = document.createElement('img');
        faceIcon.className = 'face-icon nofancybox';
        faceIcon.alt = '';
        switch (u.icon) {
          case 'personal':
            faceIcon.title = 'UP 主认证';
            faceIcon.src = '/images/personal.svg';
            break;
          case 'business':
            faceIcon.title = '机构认证';
            faceIcon.src = '/images/business.svg';
            break;
          case 'big-vip':
            faceIcon.title = '大会员';
            faceIcon.src = '/images/big-vip.svg';
            break;
        }
        userDiv.appendChild(faceIcon);
      }
      const title = document.createElement('p');
      title.style.color = u.color || '';
      title.innerText = u.title;
      userDiv.appendChild(title);
      const desc = document.createElement('p');
      desc.innerText = u.desc;
      userDiv.appendChild(desc);
      const link = document.createElement('a');
      link.target = '_blank';
      link.rel = 'noopener external nofollow noreferrer';
      link.href = u.link;
      userDiv.appendChild(link);
      friends.append(userDiv);
    }
  }
  const restUserDiv = document.createElement('div');
  restUserDiv.className = 'link-grid-container';
  const restAvatar = document.createElement('object');
  restAvatar.className = 'link-grid-image';
  restAvatar.data = '/images/you.png';
  restUserDiv.appendChild(restAvatar);
  const restTitle = document.createElement('p');
  restTitle.innerText = '您';
  restUserDiv.appendChild(restTitle);
  const restDesc = document.createElement('p');
  restDesc.innerText = '是的，就是您 (=・ω・=) 您一直在支持着 wuziqian211，当然也是 wuziqian211 的朋友哟 awa';
  restUserDiv.appendChild(restDesc);
  const restLink = document.createElement('a');
  restLink.target = '_blank';
  restLink.rel = 'noopener external nofollow noreferrer';
  restLink.href = 'https://space.bilibili.com/';
  restUserDiv.appendChild(restLink);
  friends.append(restUserDiv);
})();
</script>
