---
title: 友情链接＆朋友们
date: 2022-10-29 20:11:15
updated: 2022-10-29 20:11:15
type: link
---

<!-- 友链数据在 source/_data/link.yml 中 -->

其实不止上面这些用户，还有很多人在背后默默地支持着梦春酱呢(=・ω・=)
如果您与梦春酱的关系很好，但是上面并没有列出您，请在评论区评论或者在B站私信梦春酱，梦春酱在这里表示十分抱歉！(´；ω；\`)

### 加入贵站到本站友情链接——申请友情链接说明

如您想申请加入本站的友情链接，请您阅读以下说明：

<details>
<summary>点击展开</summary>
<div class="details">

#### 申请前——申请条件

1. 网站内容必须符合中华人民共和国相关法律法规，且**不能与代理服务器、VPN、广告等相关**；
2. 网站必须要有实质性的内容，本站不接受空白的或者全是无意义内容的网站；
3. 网站可以在中国大陆地区正常访问，且页面显示正常，访问速度在可接受的范围内；
4. 原则上，您申请的网站的类型应该是**个人博客**，而不是社交平台的个人主页（如果您有B站账号，可以考虑申请添加您到“[朋友们](#朋友们)”部分）。

{% note info %}
梦春酱不会检查您是否将本站添加到贵站友链。
{% endnote %}

#### 申请中——申请方式

在[本页面的评论区](#waline)评论即可申请友情链接，建议您参照以下格式评论：

```text
网站名称：
网站链接：
网站图标：
网站描述：
```

梦春酱可能会在将贵站添加在本站友链时修改部分信息；同时，**若您没有特别说明，梦春酱会将贵站的图标存储到本站的服务器上。**

#### 通过申请后——友链定期检查

梦春酱会在力所能及的范围内定期检查您的网站；若贵站出现问题，包括但不限于：

- 页面显示异常、网站无法访问
- 发布不符合中华人民共和国法律法规的内容
- 网站被恶意注入内容，网站服务器被恶意攻击、劫持
- 域名到期

那么，梦春酱可能会通知您，并且会将贵站移至“无法访问的友链”或直接移除友情链接。
{% note warning %}
由于部分网站没有备案、域名未实名认证、未加强防护等，梦春酱**无法确保友情链接没有任何风险**。
{% endnote %}

希望我们一起努力，共同进步！(=・ω・=)

</div>
</details>

### 加入本站到贵站友情链接——本站信息

如果您想将本站添加到贵站的友情链接，您可以使用以下信息：

<details>
<summary>点击展开</summary>
<div class="details">

{% tabs 本站信息 %}
<!-- tab ⚙️通用格式 -->

| 网站名称 | 网站链接 | 网站图标 | 网站描述 |
| :------: | :------: | :------: | :------: |
| 晨叶梦春的小屋 | <https://www.yumeharu.top/> | ![站点图标](/images/icon.png_compressed.webp)<https://www.yumeharu.top/images/icon.png_compressed.webp> | Not for the best, just for the better.<br />或<br />不求最好，只求更好。 |

| 站长昵称 | 站长头像 | 网站截图 |
| :------: | :------: | :------: |
| 晨叶梦春 | <img class="avatar" alt="站长头像" src="/images/face.png_compressed.webp" /><https://www.yumeharu.top/images/face.png_compressed.webp> | ![站点截图](/images/screenshot_compressed.webp)<https://www.yumeharu.top/images/screenshot_compressed.webp> |

<!-- endtab -->

<!-- tab 🚩YAML -->
```yml
# 此 YAML 文件仅供参考，您可能需要进行适当修改
  - name: 晨叶梦春的小屋            # 网站名称
    link: https://www.yumeharu.top/ # 网站链接
    icon: https://www.yumeharu.top/images/icon.png_compressed.webp         # 网站图标
    description: Not for the best, just for the better. # 网站描述，也可使用 “不求最好，只求更好。”
    author: 晨叶梦春                # 站长昵称
    avatar: https://www.yumeharu.top/images/face.png_compressed.webp       # 站长头像
    screenshot: https://www.yumeharu.top/images/screenshot_compressed.webp # 网站截图
```
<!-- endtab -->

<!-- tab 📄HTML -->
```html
<a target="_blank" rel="noopener external nofollow noreferrer" href="https://www.yumeharu.top/">晨叶梦春的小屋</a>
```
<!-- endtab -->

{% endtabs %}

</div>
</details>

<script data-pjax>
(async () => {
  const imageErrorHandler = function () {
    this.onerror = null;
    this.src = '/images/default-faces&face-icons/akkarin.png';
  };
  const renderUserDiv = (info, lostContact) => {
    const userDiv = document.createElement('div');
    userDiv.className = 'flink-list-item';
    const link = document.createElement('a');
    link.className = 'cf-friends-link';
    link.href = info.l;
    link.rel = 'external nofollow noreferrer';
    if (!lostContact) link.setAttribute('cf-href', info.l);
    link.title = info.t;
    link.target = '_blank';
    const avatar = document.createElement('img');
    avatar.className = `${lostContact ? '' : 'cf-friends-avatar '}no-lightbox`;
    avatar.dataset.lazySrc = info.a;
    if (!lostContact) avatar.setAttribute('cf-src', info.a);
    avatar.onerror = imageErrorHandler;
    avatar.alt = info.t;
    link.appendChild(avatar);
    /*
    if ([0, 1, 2].includes(info.i)) {
      const faceIcon = document.createElement('img');
      faceIcon.className = 'face-icon no-fancybox';
      faceIcon.alt = '';
      switch (info.i) {
        case 0:
          faceIcon.title = `UP 主认证：${info.o}`;
          faceIcon.src = '/images/default-faces%26face-icons/personal.svg';
          break;
        case 1:
          faceIcon.title = `机构认证：${info.o}`;
          faceIcon.src = '/images/default-faces%26face-icons/business.svg';
          break;
        case 2:
          faceIcon.title = '大会员';
          faceIcon.src = '/images/default-faces%26face-icons/big-vip.svg';
          break;
      }
      userDiv.appendChild(faceIcon);
    }
    if (info.n) {
      const nftFaceIcon = document.createElement('img');
      nftFaceIcon.className = `face-icon${[0, 1, 2].includes(info.i) ? ' second' : ''} no-fancybox`;
      nftFaceIcon.alt = '';
      nftFaceIcon.title = '数字藏品';
      nftFaceIcon.src = '/images/default-faces%26face-icons/nft-label.gif';
      userDiv.appendChild(nftFaceIcon);
    }
    */
    const infoDiv = document.createElement('div');
    infoDiv.className = 'flink-item-info';
    const name = document.createElement('div');
    name.className = `flink-item-name cf-friends-name${lostContact ? '-lost-contact' : ''}`;
    name.style.color = info.c || '';
    name.innerText = info.t;
    infoDiv.appendChild(name);
    if (!lostContact) {
      const desc = document.createElement('div');
      desc.className = 'flink-item-desc';
      desc.innerText = info.d;
      infoDiv.appendChild(desc);
    }
    link.appendChild(infoDiv);
    userDiv.appendChild(link);
    return userDiv;
  };

  const friends = document.querySelector('div.anzhiyu-flink-list:not(.cf-friends-lost-contact)'),
        deletedFriends = document.querySelector('div.anzhiyu-flink-list.cf-friends-lost-contact');
  if (!friends) return;
  try {
    const json = await (await fetch('https://api.yumeharu.top/api/modules?id=friends&version=3&type=json')).json();
    friends.innerText = '';
    if (json.code === 0) {
      for (const u of json.data.n.sort(() => 0.5 - Math.random())) {
        friends.append(renderUserDiv(u));
      }
      if (deletedFriends) {
        for (const u of json.data.d.sort(() => 0.5 - Math.random())) {
          deletedFriends.append(renderUserDiv(u, true));
        }
      }
    }
  } catch {
    friends.innerText = '';
  } finally {
    friends.append(renderUserDiv({
      a: '/images/default-faces%26face-icons/akkarin.png',
      t: '您',
      d: '是的，就是您 (=・ω・=) 您一直在支持着梦春酱，当然也是梦春酱的朋友哟 awa',
      l: 'https://space.bilibili.com/',
    }));
  }
})();
</script>
