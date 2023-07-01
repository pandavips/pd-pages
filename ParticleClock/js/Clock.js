const geyDateStr = () => {
  const date = new Date();

  const y = date.getFullYear();

  const m = date.getMonth() + 1;

  const d = date.getDate();

  const weeks = [
    "星期 日",
    "星期 一",
    "星期 二",
    "星期 三",
    "星期 四",
    "星期 五",
    "星期 六",
  ];

  const day = date.getDay();

  return `${y}年 - ${m}月 - ${d}日  ${weeks[day]}`;
};

const setDate = (app) => {
  // 日期
  const date = new PIXI.Text(
    geyDateStr(),
    new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 100,
      fill: "white",
      stroke: "blue",
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: "#fff",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    })
  );
  date.x = 400;
  date.y = 920;
  app.stage.addChild(date);

  return date;
};

const colors = [
  0xffb6c1, 0xdc143c, 0xdb7093, 0xff00ff, 0x9400d3, 0x4169e1, 0x1e90ff,
  0xadd8e6, 0x00ffff, 0x7fffaa, 0x00ff7f, 0x32cd32, 0xffff00, 0xffd700,
  0xffa500, 0xff4500, 0xff0000, 0xffffff,
];

// 返回一个包含开始结束的范围整数
const randomIntegerRang = (min, max) => {
  min = ~~min;
  max = ~~max;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 获取随机颜色
const getColor = () => {
  return colors[randomIntegerRang(0, colors.length - 1)];
};

// 补零
const fillZero = (n) => {
  return String(n < 10 ? "0" + n : n);
};

// 分割数组
const splitNumber = (number) => {
  return fillZero(number)
    .split("")
    .map((n) => {
      return +n;
    });
};

class Dot {
  constructor(option) {
    const vt = randomIntegerRang(-5, 5);
    const {
      size = randomIntegerRang(3, 10),
      color = colors[randomIntegerRang(0, colors.length - 1)],
      x = 0,
      y = 0,
      vx = vt === 0 ? randomIntegerRang(1, 3) : vt,
      vy = vt === 0 ? randomIntegerRang(1, 3) : vt,
      // 目标点
      target = void 0,
      // 舞台
      app,
    } = option;
    this.app = app;

    this.vx = vx;
    this.vy = vy;
    this.target = target;
    const circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(x, y, size / 2);
    circle.endFill();
    // pixi的图形实例对象
    this.core = circle;
    this.randomPosition();
  }
  // 移动
  move() {
    this.vtHandler();
    const core = this.core;
    core.x = core.x + this.vx;
    core.y = core.y + this.vy;
  }
  // 计算速度
  vtHandler() {
    const core = this.core;
    const absVx = Math.abs(randomIntegerRang(1, 10));
    const absVy = Math.abs(randomIntegerRang(1, 10));
    const xMax = this.app.renderer.width;
    const yMax = this.app.renderer.height;

    // 两种情况,
    // 1.目标点,向目标点飘逸
    if (this.target) {
      const diffX = this.target.x - core.x;
      const diffY = this.target.y - core.y;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);

      // 如果离目标点够近那么就不要再移动了
      this.vx = absX < 2 ? 0 : diffX > 0 ? absVx : -absVx;
      this.vy = absY < 2 ? 0 : diffY > 0 ? absVy : -absVy;
    }
    // 2.没有目标点,那么就漫无目的的漂浮,只要别飘出这个舞台的边界
    if (core.x >= xMax) {
      this.vx = -absVx;
    }
    if (core.x <= 0) {
      this.vx = absVx;
    }
    if (core.y >= yMax) {
      this.vy = -absVy;
    }
    if (core.y <= 0) {
      this.vy = absVy;
    }
  }
  // 重新随机位置
  randomPosition() {
    this.core.x = randomIntegerRang(0, this.app.renderer.width);
    this.core.y = randomIntegerRang(0, this.app.renderer.height);
  }
  // 设置颜色
  setColor(color) {
    this.core.graphicsData[0].fillColor = color;
  }
}

class NumberDotGroup {
  edgeMap = new Map([
    // 点位顺序 左>右 + 上>下
    [1, { point: [0, 0, 1, 0], offset: { x: 1, y: 0 } }],
    [2, { point: [0, 1, 1, 1], offset: { x: 1, y: 1 } }],
    [3, { point: [0, 2, 1, 2], offset: { x: 1, y: 2 } }],
    [4, { point: [0, 0, 0, 1], offset: { x: 0, y: 1 } }],
    [5, { point: [1, 0, 1, 1], offset: { x: 1, y: 1 } }],
    [6, { point: [0, 1, 0, 2], offset: { x: 0, y: 2 } }],
    [7, { point: [1, 1, 1, 2], offset: { x: 1, y: 2 } }],
  ]);
  pointMap = new Map([
    [0, [1, 3, 4, 5, 6, 7]],
    [1, [5, 7]],
    [2, [1, 5, 2, 6, 3]],
    [3, [1, 5, 2, 7, 3]],
    [4, [4, 2, 5, 7]],
    [5, [1, 4, 2, 7, 3]],
    [6, [1, 4, 6, 3, 7, 2]],
    [7, [1, 5, 7]],
    [8, [1, 2, 3, 4, 5, 6, 7]],
    [9, [1, 2, 3, 4, 5, 7]],
  ]);

  constructor(option) {
    const {
      width,
      countOnEdge,
      app,
      number = 1,
      x = 50,
      y = 50,
      color,
    } = option;

    this.x = x;
    this.y = y;
    this.app = app;
    this.width = width;
    this.countOnEdge = countOnEdge;

    // 满载情况粒子
    this.dotTotalCount = 7 * countOnEdge;
    this.dotSize = width / countOnEdge;
    this.dotsTotal = new Array(this.dotTotalCount).fill(0).map(() => {
      return new Dot({
        size: this.dotSize,
        color: 0xffffff,
        app,
      });
    });
    this.dots = [];

    this.setNumber(number);
  }
  clear() {
    this.dotsTotal.forEach((d) => {
      this.app.stage.removeChild(d.core);
    });
  }
  setNumber(val = 8) {
    this.number = val;

    const edge = this.pointMap.get(val);
    const count = edge.length * this.countOnEdge;

    // 先清空粒子，加入对应数量的粒子
    this.clear();

    this.dots = this.dotsTotal.slice(0, count);
    // 计算粒子的xy
    let currIndex = 0;
    edge.forEach((e) => {
      // 获取点位
      const pointInfo = this.edgeMap.get(e);
      const pointArr = pointInfo.point;
      const start = [pointArr[0], pointArr[1]];
      const end = [pointArr[2], pointArr[3]];
      // 起始位置
      const startPoint = {
        x: start[0] * this.width + this.x,
        y: start[1] * this.width + this.y,
      };
      // 排列趋势
      const trend = {
        x: end[0] - start[0],
        y: end[1] - start[1],
      };
      const dotSize = this.dotSize;
      for (let i = 0; i < this.countOnEdge; i++) {
        const dot = this.dots[currIndex];
        // dot.setColor(pointInfo.color);
        const tx =
          pointInfo.offset.x * dotSize +
          (trend.x === 0 ? startPoint.x : startPoint.x + i * dotSize);
        const ty =
          pointInfo.offset.y * dotSize +
          (trend.y === 0 ? startPoint.y : startPoint.y + i * dotSize);
        dot.target = {
          x: tx,
          y: ty,
        };
        currIndex++;
      }
    });

    this.render();
  }
  render() {
    this.dots.forEach((d) => {
      this.app.stage.addChild(d.core);
    });
  }
  run() {
    this.dots.forEach((d) => {
      d.move();
    });
  }
}
class Separator {
  constructor(option) {
    const { app, width, x = 50, y = 50, color } = option;
    this.app = app;
    this.width = width;
    this.dotSize = width;
    this.x = x;
    this.y = y;

    this.dots = new Array(2).fill(0).map(() => {
      return new Dot({
        size: this.dotSize,
        color,
        app,
      });
    });

    this.render();
  }
  render() {
    this.dots.forEach((d, i) => {
      const core = d.core;
      core.y = i === 0 ? this.y + this.width : this.y + this.width * 3;
      core.x = this.x;
      this.app.stage.addChild(core);
    });
  }
}
class Clock {
  constructor(option) {
    const {
      x = window.innerWidth / 2 - 100 * 7,
      y = 510,
      width = 95,
      app,
    } = option;
    this.x = x;
    this.y = y;

    // 时
    this.h = [
      new NumberDotGroup({
        width,
        app,
        countOnEdge: 5,
        x: this.x,
        y,
      }),
      new NumberDotGroup({
        width,
        app,
        countOnEdge: 5,
        x: this.x + width * 2,
        y,
      }),
    ];

    // 分割符
    this.separat1 = new Separator({
      width: width / 2,
      app,
      x: this.x + width * 4.5,
      y,
      color: 0xadd8e6,
    });

    // 分
    this.m = [
      new NumberDotGroup({
        width,
        app,
        countOnEdge: 5,
        x: this.x + width * 5.5,
        y,
      }),
      new NumberDotGroup({
        width,
        app,
        countOnEdge: 5,
        x: this.x + width * 7.5,
        y,
      }),
    ];

    // 分割符
    this.separat2 = new Separator({
      width: width / 2,
      app,
      x: this.x + width * 9.6,
      y,
      color: 0xadd8e6,
    });

    // 秒
    this.s = [
      new NumberDotGroup({
        width: width * 1.3,
        app,
        countOnEdge: 4,
        x: this.x + width * 10.5,
        y,
      }),
      new NumberDotGroup({
        width: width * 1.3,
        app,
        countOnEdge: 3,
        x: this.x + width * 13,
        y,
      }),
    ];
  }

  run() {
    const date = new Date();
    const hArr = splitNumber(date.getHours());
    const mArr = splitNumber(date.getMinutes());
    const sArr = splitNumber(date.getSeconds());

    this.h[0].setNumber(hArr[0]);
    this.h[0].run();
    this.h[1].setNumber(hArr[1]);
    this.h[1].run();

    this.m[0].setNumber(mArr[0]);
    this.m[0].run();
    this.m[1].setNumber(mArr[1]);
    this.m[1].run();

    this.s[0].setNumber(sArr[0]);
    this.s[0].run();
    this.s[1].setNumber(sArr[1]);
    this.s[1].run();
  }
}
