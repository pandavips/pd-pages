/**
 * 纯粹的粒子类,只包含粒子应该有的东西
 *  这次所有的效果,粒子类是核心,YYDS
 *
 * @author PanDa
 */
class Dot {
  constructor(option) {
    const {
      color = "red",
      x = 0,
      y = 0,
      vx = 0.1,
      vy = 0.1,
      size = 1,
      area = 200 * 200,
      targetPoint,
      universe = { w: window.innerWidth, h: window.innerHeight },
    } = option;
    (this.x = x),
      (this.y = y),
      (this.vx = vx),
      (this.vy = vy),
      (this.size = size),
      (this.color = color);
    // 可以把粒子想象成一个星球,erea可以当作是他的引力范围
    this.area = area;
    // 粒子的活动范围,=>宇宙空间
    this.universe = universe;
    // 身为粒子,本身也得有一些追求才是,一出生就得有个目标
    this.targetPoint = targetPoint || null;
    // 懂得适时显示和隐藏的粒子才是好粒子
    this.show = true;
    // 保存一份粒子的备份基因信息
    this.meta = {
      color,
      x,
      y,
      vx,
      vy,
      size,
      area,
      targetPoint,
      universe,
    };
  }
  run(time) {
    // 自己运动轨迹
    this.x = this.x + time * this.vx;
    this.y = this.y + time * this.vy;
  }
  // 当粒子有自己的目标的时候
  setSpeedBytargetPoint(point) {
    const speed = utils.getSpeed(point, this, Math.random() * 5);
    const dx = Math.abs(this.x - point.x);
    const dy = Math.abs(this.y - point.y);
    if (dx < 1 && dy < 1) {
      this.vx = 0;
      this.vy = 0;
    } else {
      this.vx = speed.vx;
      this.vy = speed.vy;
    }
  }
  // 当粒子没有自己的目标的时候
  setSpeedNormal() {
    // 从meta中获取被干扰之前的值,恢复往日的平静
    this.vx = this.meta.vx;
    this.vy = this.meta.vy;
    // 判断边界
    if (this.x + this.size / 2 > this.universe.w || this.x - this.size <= 0) {
      this.vx = -this.vx;
      this.meta.vx = this.vx; //要及时更新meta
    }
    if (this.y + this.size / 2 > this.universe.h || this.y - this.size <= 0) {
      this.vy = -this.vy;
      this.meta.vy = this.vy;
    }
  }
  // 当粒子收到外力
  setSpeedByInterfere(interfere) {
    this.vx = interfere.vx;
    this.vy = interfere.vy;
  }
  /**
   *
   * @param {*} time 时间粒度
   *
   * 和日常生活一样,如果有外力的情况下,粒子将改变自己的轨迹
   */
  update(option) {
    const { time = 1, interfere } = option;

    if (interfere && interfere.vx && interfere.vy) {
      this.setSpeedByInterfere(interfere);
    } else if (this.targetPoint) {
      this.setSpeedBytargetPoint(this.targetPoint);
    } else {
      this.setSpeedNormal();
    }

    this.run(time);
  }

  // 粒子需要展示自己的方式
  render(ctx, option) {
    if (this.show) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    this.update(option);
  }

  // 判断一个点是否在自己的引力范围
  isRange(p) {
    return utils.isRange(p, this, this.area);
  }
}
