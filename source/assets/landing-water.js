(() => {
  const stage = document.querySelector('#island-stage');
  const canvas = document.querySelector('#landscape-water');
  const photo = document.querySelector('.landscape-photo');
  const landscape = document.querySelector('.landscape');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!stage || !canvas || !photo || !landscape) return;

  if (!reducedMotion.matches && window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('pointermove', event => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      stage.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
      stage.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.removeProperty('--tilt-x');
      stage.style.removeProperty('--tilt-y');
    });
  }

  if (reducedMotion.matches) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  let width = 0;
  let height = 0;
  let scale = 1;
  let imageX = 0;
  let imageY = 0;
  let waterTop = 0;
  let frame = 0;
  let lastDraw = 0;

  function resize() {
    width = landscape.clientWidth;
    height = landscape.clientHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.ceil(width * pixelRatio);
    canvas.height = Math.ceil(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight) * 1.03;
    imageX = (width - photo.naturalWidth * scale) / 2;
    imageY = (height - photo.naturalHeight * scale) / 2;
    // Start the ripple layer at the lake shore in the illustrated background.
    waterTop = Math.max(0, imageY + photo.naturalHeight * scale * .7);
  }

  function draw(time) {
    frame = requestAnimationFrame(draw);
    if (document.hidden || time - lastDraw < 33) return;
    lastDraw = time;
    context.clearRect(0, 0, width, height);
    const phase = time * .001;
    const strip = 5;
    for (let y = Math.floor(waterTop); y < height; y += strip) {
      const depth = Math.max(0, (y - waterTop) / Math.max(1, height - waterTop));
      const wave = Math.sin(y * .055 + phase * 1.8) * (1.4 + depth * 4.4)
        + Math.sin(y * .12 - phase * 1.15) * (1 + depth * 1.8);
      const sourceX = Math.max(0, Math.min(photo.naturalWidth - width / scale, (-imageX + wave) / scale));
      const sourceY = Math.max(0, (y - imageY) / scale);
      const sourceHeight = Math.min(strip / scale + .35, photo.naturalHeight - sourceY);
      if (sourceHeight > 0) {
        context.drawImage(photo, sourceX, sourceY, width / scale, sourceHeight, 0, y, width, strip + 1);
      }
    }
  }

  function start() {
    resize();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  }
  if (photo.complete && photo.naturalWidth) start();
  else photo.addEventListener('load', start, { once: true });
  window.addEventListener('resize', () => { if (photo.naturalWidth) resize(); }, { passive: true });
})();
