'use strict';
hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/assets/forest.css">');
// Stellar 1.44 declares sidebar with const, while its TOC handler reads window.sidebar.
hexo.extend.injector.register('body_end', '<script>document.addEventListener("DOMContentLoaded",function(){if(typeof sidebar!=="undefined")window.sidebar=sidebar;});</script>');
hexo.extend.injector.register('body_end', '<script src="/assets/moments.js" defer></script>');
hexo.extend.injector.register('body_end', '<script src="/assets/site-stats.js" defer></script>');
