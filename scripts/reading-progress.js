'use strict';
hexo.extend.filter.register('after_post_render',function(data){if(data.wiki||['post','wiki','note','topic'].includes(data.layout)){data.content='<div data-reading-content>'+data.content+'</div>';}return data;});
hexo.extend.injector.register('head_end','<link rel="stylesheet" href="/assets/reading-progress.css">');
hexo.extend.injector.register('body_end','<script src="/assets/reading-progress.js" defer></script>');
