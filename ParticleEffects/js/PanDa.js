/**
 * 该类负责维护整个宇宙的数据
 *
 * @author PanDa
 */
class PanDa {
  constructor(option) {
    const {
      rule,
      data,
      width = window.innerWidth,
      height = window.innerHeight,
    } = option;
    const canvas = data.canvas;
    canvas.width = width;
    canvas.height = height;
    // 宇宙的规则
    this.rule = {
      // 粒子数量
      num_dot: rule.num_dot,
      // 时间粒度
      timeSpedd: rule.timeSpedd || 1,
      width,
      height,
    };
    // 宇宙的事物
    this.data = {
      // 展示宇宙的媒介
      canvas: canvas,
      ctx: canvas.getContext("2d"),
      // 宇宙的粒子
      dotData: {
        free: [],
        word: [],
        jaychou: [],
        time: [],
        alien: [],
      },
      // 停止点
      cancelId: "",
      // 上帝
      lord: {
        // 上帝的位置
        lord_point: null,
      },
      // 外星文明会传递一些信息
      alien: {
        msg: "",
      },
    };
    this.init();
  }

  init() {
    this.bind();
    this.createC2D();
    this.generateDot();
  }

  createC2D() {
    this.c2d = new Canvas2Dot();
  }

  // 宇宙的的运转
  run() {
    this.data.cancelId = requestAnimationFrame(() => {
      this.data.ctx.clearRect(
        0,
        0,
        this.data.canvas.width,
        this.data.canvas.height
      );
      this.dotRun(this.data.dotData.free, false, true);
      this.dotRun(this.data.dotData.word, true, true);
      this.dotRun(this.data.dotData.alien, false, false);
      this.dotRun(this.data.dotData.time, true);
      this.dotRun(this.data.dotData.jaychou, true);
      this.run();
    });
  }
  // 当前宇宙粒子总数量
  getDotNumber() {
    let dot_num = 0;
    const keys = Object.keys(this.data.dotData);
    for (const key of keys) {
      dot_num += this.data.dotData[key].length;
    }
    console.log("当前粒子数量", dot_num);
  }
  acceptHigherDimensional(msg) {
    this.getDotNumber();

    if (msg == "#stop") {
      this.data.cancelId && cancelAnimationFrame(this.data.cancelId);
      this.data.cancelId = null;
      return;
    }
    if (msg == "#start") {
      !this.data.cancelId && this.run();
      return;
    }
    this.data.dotData.alien = [];
    const piontData = this.c2d.getDotPiontDataByWord({
      words: msg,
    });
    piontData.forEach((el) => {
      const targetPoint = {
        x: el.x * 1.5,
        y: el.y * 1.5,
      };
      const dot = new Dot({
        // const { color = "red", x = 0, y = 0, vx = 0.1, vy = 0.1, size = 2, area = 120 * 120, universe = { w: window.innerWidth, h: window.innerHeight } } = option;
        x:
          targetPoint.x + utils.getPositiveAndNegative() * utils.random(0, 150),
        y:
          targetPoint.y + utils.getPositiveAndNegative() * utils.random(0, 150),
        // color: `hsl(${utils.random(0, 360)}, ${utils.random(90, 100)}%, 50%)`,
        color: `#fff`,
        universe: {
          w: this.data.canvas.width,
          h: this.data.canvas.height,
        },
        targetPoint,
        size: 1,
      });
      this.data.dotData.alien.push(dot);
    });
  }

  // 粒子的运转
  dotRun(dotArr, lord = false, lineToLord = false) {
    for (const dot of dotArr) {
      // 上帝的化学反应
      const interfere =
        lord &&
        this.data.lord.point &&
        dot.isRange(this.data.lord.point) &&
        utils.getSpeed(this.data.lord.point, dot);
      lineToLord &&
        this.data.lord.point &&
        dot.isRange(this.data.lord.point) &&
        utils.pointLineToPoint(
          this.data.lord.point,
          dot,
          dot.area,
          this.data.ctx
        );
      dot.render(this.data.ctx, {
        // 外力强行改变运动轨迹
        interfere,
      });
    }
  }

  // 生成初始化粒子
  generateDot() {
    // 自由的背景粒子
    for (let i = 0; i < this.rule.num_dot; i++) {
      const dot = new Dot({
        // const { color = "red", x = 0, y = 0, vx = 0.1, vy = 0.1, size = 2, area = 120 * 120, universe = { w: window.innerWidth, h: window.innerHeight } } = option;
        color: `hsl(${utils.random(0, 360)}, ${utils.random(90, 100)}%, 50%)`,
        x: Math.ceil(Math.random() * this.data.canvas.width),
        y: Math.ceil(Math.random() * this.data.canvas.height),
        vx: 2 * Math.random() - 1,
        vy: 2 * Math.random() - 1,
        universe: {
          w: this.data.canvas.width,
          h: this.data.canvas.height,
        },
        size: utils.random(2, 10),
      });
      this.data.dotData.free.push(dot);
    }

    // 永远的jay chou
    (() => {
      const img = new Image();
      img.src = "./img/ynp.jpg";
      img.onload = () => {
        const piontData2 = this.c2d.getDotPiontDataByImg({
          img: img,
        });
        piontData2.forEach((el) => {
          const targetPoint = {
            x: el.x * 2 + this.data.canvas.width * 0.3,
            y: el.y * 2 + this.data.canvas.height * 0.4,
          };
          const dot = new Dot({
            // const { color = "red", x = 0, y = 0, vx = 0.1, vy = 0.1, size = 2, area = 120 * 120, universe = { w: window.innerWidth, h: window.innerHeight } } = option;
            x:
              targetPoint.x +
              utils.getPositiveAndNegative() * utils.random(0, 150),
            y:
              targetPoint.y +
              utils.getPositiveAndNegative() * utils.random(0, 150),
            // color: `hsl(${utils.random(0, 360)}, ${utils.random(90, 100)}%, 50%)`,
            color: el.color,
            universe: {
              w: this.data.canvas.width,
              h: this.data.canvas.height,
            },
            targetPoint,
            size: 5,
          });
          this.data.dotData.jaychou.push(dot);
        });
      };
    })();

    // 时间字符串
    (() => {
      let timeStr = "";
      const setTime = () => {
        // 获取时间
        const date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        hour = hour < 10 ? "0" + hour : hour;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        const currTimeStr = hour + " : " + minutes;
        if (timeStr != currTimeStr) {
          timeStr = currTimeStr;
          this.data.dotData.time = [];
          const pointData = this.c2d.getDotPiontDataByWord({
            // words: `88 : 88 : 88`,
            words: currTimeStr,
          });
          pointData.forEach((el) => {
            const targetPoint = {
              x: el.x * 4 + this.data.canvas.width * 0.6,
              y: el.y * 4 + this.data.canvas.height * 0.7,
            };
            const dot = new Dot({
              // const { color = "red", x = 0, y = 0, vx = 0.1, vy = 0.1, size = 2, area = 120 * 120, universe = { w: window.innerWidth, h: window.innerHeight } } = option;
              x:
                targetPoint.x +
                utils.getPositiveAndNegative() * utils.random(0, 150),
              y:
                targetPoint.y +
                utils.getPositiveAndNegative() * utils.random(0, 150),
              // color: `hsl(${utils.random(0, 360)}, ${utils.random(90, 100)}%, 50%)`,
              color: "#fff",
              universe: {
                w: this.data.canvas.width,
                h: this.data.canvas.height,
              },
              targetPoint,
              size: 4,
            });
            this.data.dotData.time.push(dot);
          });
        }
      };
      setTime();
      setInterval(setTime, 1000 * 30);
    })();

    // 骚话
    (() => {
      this.data.dotData.word = [];
      const piontData = this.c2d.getDotPiontDataByWord({
        words: "JUST DO IT.",
      });
      piontData.forEach((el) => {
        const targetPoint = {
          x: el.x * 2 + this.data.canvas.width * 0.6,
          y: el.y * 2 + this.data.canvas.height * 0.5,
        };
        const dot = new Dot({
          // const { color = "red", x = 0, y = 0, vx = 0.1, vy = 0.1, size = 2, area = 120 * 120, universe = { w: window.innerWidth, h: window.innerHeight } } = option;
          x:
            targetPoint.x +
            100 +
            utils.getPositiveAndNegative() * utils.random(0, 150),
          y:
            targetPoint.y +
            100 +
            utils.getPositiveAndNegative() * utils.random(0, 150),
          color: `hsl(${utils.random(0, 360)}, ${utils.random(90, 100)}%, 50%)`,
          // color: `#fff`,
          universe: {
            w: this.data.canvas.width,
            h: this.data.canvas.height,
          },
          targetPoint,
          size: 2,
        });
        this.data.dotData.word.push(dot);
      });
    })();
  }

  // 宇宙本身应该就存在一些机制
  bind() {
    // 当上帝来到某些元素身边,理应发生一些化学反应
    this.data.canvas.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      this.data.lord.point = {
        x: clientX,
        y: clientY,
      };
    });
    // 当上帝离开后,也应该剪断这些化学反应的源头
    this.data.canvas.addEventListener("mouseout", (e) => {
      this.data.lord.point = null;
    });
  }
}
