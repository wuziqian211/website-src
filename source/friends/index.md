---
title: 友情链接＆朋友们
date: 2022-10-29 20:11:15
updated: 2022-10-29 20:11:15
template: links
---

<!-- 友链数据在 source/_data/links.yml 中 -->

如果您也想申请友情链接的话，可以在这个Blog的评论区评论哟awa

##### 申请友情链接

欢迎您申请加入本站的友情链接！请您在申请友链前阅读以下说明：
{% folding blue::点击展开 %}

###### 申请规则

1. 网站内容必须符合中华人民共和国相关法律法规，且**不能与代理服务器、VPN、广告等相关**；
2. 网站必须要有实质性的内容，本站不接受空白的或者全是无意义内容的网站；
3. 网站可以在中国大陆地区正常访问，且页面显示正常，访问速度在可接受的范围内；
4. 原则上，您申请的网站的类型应该是**个人博客**，而不是社交平台的个人主页（如果您有B站账号，可以考虑申请添加您到“[朋友们](#朋友们)”部分）。

{% note info %}
梦春酱不会检查您是否将本站添加到贵站友链。
{% endnote %}

###### 申请方式

在[本页面的评论区](#waline)评论即可申请友情链接，建议您参照以下格式评论：

```text
网站名称：
网站链接：
网站图标：
网站描述：
```

梦春酱可能会在将贵站添加在本站友链时修改部分信息；同时，**若您没有特别说明，梦春酱会将贵站的图标存储到本站的服务器上。**

###### 友链的定期检查、可能存在的风险说明

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
{% endfolding %}

##### 本站信息

如果您想将本站添加到贵站的友情链接，您可以使用以下信息：

{% folding blue::点击展开 %}

{% tabs 本站信息 %}
<!-- tab ⚙️通用格式 -->

| 网站名称 | 网站链接 | 网站图标 | 网站描述 |
| :------: | :------: | :------: | :------: |
| 晨叶梦春的小屋 | <https://www.yumeharu.top/> | ![站点图标](/images/icon_compressed.png)<https://www.yumeharu.top/images/icon_compressed.png> | Not for the best, just for the better.<br />或<br />不求最好，只求更好。 |

| 站长昵称 | 站长头像 | 网站截图 |
| :------: | :------: | :------: |
| 晨叶梦春 | <img class="avatar" alt="站长头像" src="/images/face_compressed.png" /><https://www.yumeharu.top/images/face_compressed.png> | ![站点截图](/images/screenshot_compressed.png)<https://www.yumeharu.top/images/screenshot_compressed.png> |

<!-- endtab -->

<!-- tab 🚩YAML -->
```yml
# 此 YAML 文件仅供参考，您可能需要进行适当修改
  - name: 晨叶梦春的小屋            # 网站名称
    link: https://www.yumeharu.top/ # 网站链接
    icon: https://www.yumeharu.top/images/icon_compressed.png             # 网站图标
    description: Not for the best, just for the better.                   # 网站描述，也可使用 “不求最好，只求更好。”
    author: 晨叶梦春                 # 站长昵称
    avatar: https://www.yumeharu.top/images/face_compressed.png           # 站长头像
    screenshot: https://www.yumeharu.top/images/screenshot_compressed.png # 网站截图
```
<!-- endtab -->

<!-- tab 📄HTML -->
```html
<a target="_blank" rel="noopener external nofollow noreferrer" href="https://www.yumeharu.top/">晨叶梦春的小屋</a>
```
<!-- endtab -->

{% endtabs %}

{% endfolding %}

#### 朋友们

{% note warning %}
由于B站接口的限制，以下朋友的信息并非实时更新。
{% endnote %}

<ul class="grid mb-6 gap-4 grid-cols-2" id="friends">正在加载中……</ul>

<details id="deleted-friends-wrap" style="display: none;">
<summary>查看已经注销的朋友</summary>
<div class="details">

已经注销，但曾经和梦春酱存在一定关系的朋友有这些：

<div class="link-grid" id="deleted-friends"></div>

这些朋友的注销，给梦春酱带来了一定程度的损失，梦春酱非常希望能有缘再见到TA们(´；ω；\`)当然有些朋友已经创建新的账号啦awa

</div>
</details>

其实不止上面这些用户，还有很多人在背后默默地支持着梦春酱呢(=・ω・=)
如果您与梦春酱的关系很好，但是上面并没有列出您，请在评论区评论或者在B站私信梦春酱，梦春酱在这里表示十分抱歉！(´；ω；\`)

<script data-swup-reload-script>
(async () => {
  const renderUserLi = info => {
    const userLi = document.createElement('li');
    userLi.className = 'group transform scale-100 transition-transform duration-100 ease-linear active:scale-95', userLi.style.listStyle = 'none', userLi.style.marginLeft = '0';
    const link = document.createElement('a');
    link.target = '_blank', link.rel = 'noopener external nofollow noreferrer', link.href = info.l;
    const innerDiv = document.createElement('div');
    innerDiv.className = 'flex flex-row items-center gap-1 sm:gap-2 overflow-hidden min-w-0 rounded-lg shadow-redefine-flat';
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'h-16 w-16 rounded-bl-lg bg-third-background-color';
    const avatar = document.createElement('img');
    avatar.className = 'rounded-l-lg h-16 w-16 max-w-none', avatar.src = info.a, avatar.onerror = 'this.style.display=&quot;none&quot;';
    avatarDiv.appendChild(avatar);
    innerDiv.appendChild(avatarDiv);
    const nameDiv = document.createElement('div');
    nameDiv.className = 'flex flex-col min-w-0';
    const title = document.createElement('div');
    title.className = 'text-lg text-second-text-color ellipsis group-hover:!text-primary', title.innerText = info.t;
    nameDiv.appendChild(title);
    const desc = document.createElement('div');
    desc.className = 'text-third-text-color ellipsis', desc.innerText = info.d.replace(/\r\n|\r|\n/g, ' ');
    nameDiv.appendChild(desc);
    innerDiv.appendChild(nameDiv);
    link.appendChild(innerDiv);
    userLi.appendChild(link);
    /*
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
      userLi.appendChild(faceIcon);
    }
    if (info.n) {
      const nftFaceIcon = document.createElement('img');
      nftFaceIcon.className = `face-icon${[0, 1, 2].includes(info.i) ? ' second' : ''} no-fancybox`, nftFaceIcon.alt = '', nftFaceIcon.title = '数字藏品', nftFaceIcon.src = '/images/default-faces%26face-icons/nft-label.gif';
      userLi.appendChild(nftFaceIcon);
    }
    */
    return userLi;
  };

  const friends = document.querySelector('ul#friends'), deletedFriends = document.querySelector('div#deleted-friends');
  if (!friends) return;
  try {
    const json = await (await fetch('https://api.yumeharu.top/api/modules?id=friends&version=3&type=json')).json();
    friends.innerText = '';
    if (json.code === 0) {
      for (const u of json.data.n.sort(() => 0.5 - Math.random())) {
        friends.append(renderUserLi(u));
      }
      if (deletedFriends) {
        document.querySelector('details#deleted-friends-wrap').style.display = '';
        for (const u of json.data.d.sort(() => 0.5 - Math.random())) {
          deletedFriends.append(renderUserLi(u));
        }
      }
    }
  } catch {
    friends.innerText = '';
  } finally {
    friends.append(renderUserLi({ a: '/images/default-faces%26face-icons/akkarin.png', t: '您', d: '是的，就是一直支持着梦春酱的您 (=・ω・=)', l: 'https://space.bilibili.com/' }));
  }
})();
</script>
