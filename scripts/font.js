'use strict';
const fs = require('node:fs');
const path = require('node:path');

const fontRoot = path.dirname(require.resolve('lxgw-wenkai-webfont/package.json'));
hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/assets/fonts/lxgw/lxgwwenkai-regular.css">');
hexo.extend.filter.register('after_generate', function () {
  hexo.route.set('assets/fonts/lxgw/lxgwwenkai-regular.css', () => fs.createReadStream(path.join(fontRoot, 'lxgwwenkai-regular.css')));
  for (const file of fs.readdirSync(path.join(fontRoot, 'files'))) {
    if (!/^lxgwwenkai-regular-subset-\d+\.woff2$/.test(file)) continue;
    hexo.route.set('assets/fonts/lxgw/files/' + file, () => fs.createReadStream(path.join(fontRoot, 'files', file)));
  }
  hexo.route.set('assets/fonts/lxgw/OFL.txt', () => fs.createReadStream(path.join(fontRoot, 'OFL.txt')));
});
