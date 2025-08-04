/* global CONFIG */

'use strict';

/**
 * @template dataType
 * @typedef {{ code: number; message: string; data: dataType }} InternalAPIResponse<dataType>
 */

document.addEventListener('page:loaded', () => {
  /**
   * 为 Blog 的评论区提供上传图片的功能
   * @param {File} file - 要上传的图片
   * @returns {Promise<String>} - 图片 URL
   */
  // @ts-ignore
  CONFIG.waline.imageUploader = file => new Promise((resolve, reject) => {
    if (file.size > 4500000) {
      reject(new TypeError('文件大小不能超过 4.29 MB 哟 qwq'));
    } else if (file.size <= 0) {
      reject(new TypeError('不能选择空文件哟 qwq'));
    } else if (file.size <= 4096) {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(/** @type {string} */(reader.result)));
      reader.readAsDataURL(file);
    } else {
      /** @typedef {InternalAPIResponse<{ filename: string; url: string; size: number; width: number; height: number }>} ImageUploadResponse */
      fetch('https://api.yumeharu.top/api/modules?id=upload&type=json', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file }).then(resp => resp.json()).then(/** @param {ImageUploadResponse} ujson */ ujson => {
        if (ujson.code === 0) {
          resolve(ujson.data.url);
        } else {
          throw new TypeError(ujson.message);
        }
      }).catch(e => {
        console.error(e);
        if (file.size > 131072) {
          reject(e);
        } else {
          const reader = new FileReader();
          reader.addEventListener('load', () => resolve(/** @type {string} */(reader.result)));
          reader.readAsDataURL(file);
        }
      });
    }
  });
});

/**
 * 给被屏蔽的链接添加提示
 * @param {HTMLAnchorElement} a
 */
const bindAnchorElement = a => {
  if (blockedRegExp && blockedRegExp.test(a.hostname)) a.classList.add('inaccessible');
};

/**
 * 给 `<img>` 元素绑定事件，使图片在加载完毕前模糊
 * @param {HTMLImageElement} img
 */
const bindImageElement = img => {
  img.style.filter = 'blur(10px)';
  img.style.transition = 'filter 0.5s';
  img.addEventListener('load', () => { img.style.filter = ''; });
  if (img.src && img.complete) img.style.filter = '';
};

/** @type {RegExp} */
let blockedRegExp;

/**
 * 获取被屏蔽的链接的正则表达式
 */
(async () => {
  /** @type {{ blocked: string }} */
  const { blocked } = (await (await fetch('https://api.yumeharu.top/api/modules?id=blocked&type=json')).json()).data;
  if (blocked) {
    blockedRegExp = new RegExp(blocked);
    document.querySelectorAll('a').forEach(bindAnchorElement);
  }
})();

document.querySelectorAll('img').forEach(bindImageElement);

/** @param {Node} node */
const bindElement = node => {
  if (node instanceof HTMLElement) {
    if (node instanceof HTMLAnchorElement) {
      bindAnchorElement(node);
    } else if (node instanceof HTMLImageElement) {
      bindImageElement(node);
    }
    if (node.children.length) Array.from(node.children).forEach(bindElement);
  }
};

/**
 * 监视 DOM 树的变化
 */
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    if (m.type === 'childList') m.addedNodes.forEach(bindElement);
  }
});
observer.observe(document.body, { childList: true, subtree: true });
