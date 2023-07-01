window.onload = () => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    autoStart: true,
  });
  window.onresize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  };
  document.body.appendChild(app.view);

  // 自由粒子
  const freeDots = new Array(66).fill(0).map(() => {
    const dot = new Dot({ app });
    app.stage.addChild(dot.core);
    return dot;
  });

  // 时钟
  const clock = new Clock({
    app,
  });

  const date = setDate(app);

  const run = () => {
    requestAnimationFrame(() => {
      freeDots.forEach((dot) => {
        dot.move();
      });
      clock.run();
      date.text = geyDateStr();
      run();
    });
  };

  run();
};
