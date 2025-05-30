/* global Fancybox */

document.addEventListener('page:loaded', () => {

  /**
   * Wrap images with fancybox.
   */
  document.querySelectorAll('.post-body :not(a) > img:not(.no-fancybox), .post-body > img:not(.no-fancybox)').forEach(image => {
    const imageLink = image.dataset.src || image.src;
    const imageWrapLink = document.createElement('a');
    imageWrapLink.classList.add('fancybox');
    imageWrapLink.href = imageLink.replace(/\/(.+)\.(.+)_compressed\..+/, '\/$1.$2').replace(/\/(.+)_compressed\.(.+)/, '\/$1.$2');
    imageWrapLink.setAttribute('itemscope', '');
    imageWrapLink.setAttribute('itemtype', 'http://schema.org/ImageObject');
    imageWrapLink.setAttribute('itemprop', 'url');

    let dataFancybox = 'default';
    if (image.closest('.post-gallery') !== null) {
      dataFancybox = 'gallery';
    } else if (image.closest('.group-picture') !== null) {
      dataFancybox = 'group';
    }
    imageWrapLink.dataset.fancybox = dataFancybox;

    const imageTitle = image.title || image.alt;
    if (imageTitle) {
      imageWrapLink.title = imageTitle;
      // Make sure img captions will show correctly in fancybox
      imageWrapLink.dataset.caption = imageTitle;
    }
    image.wrap(imageWrapLink);
  });

  Fancybox.bind('[data-fancybox]');

  Fancybox.bind('.comments .wl-content img');
});
