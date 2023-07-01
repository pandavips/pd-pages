/**
 * 一些工具函数
 *
 * @author PanDa
 */

(() => {
  const utils = {
    // 生成m~n(不包含n)的随机整数
    random(m, n) {
      let num = Math.floor(Math.random() * (m - n) + n);
      return num;
    },

    // 返回-1 或者 1
    getPositiveAndNegative() {
      if (Math.random() > 0.5) {
        return 1;
      }
      return -1;
    },
    /**
     *
     * @param {*} p 目标点
     * @param {*} p2 需要运动过来的点
     */
    getSpeed(p, p2, speed) {
      const { x, y } = p;
      const { x: x2, y: y2 } = p2;
      const randomSpeed = Math.random() * this.random(8, 10);
      const vx = x - x2 > 0 ? speed || randomSpeed : -speed || -randomSpeed;
      const vy = y - y2 > 0 ? speed || randomSpeed : -speed | -randomSpeed;
      return {
        vx,
        vy,
      };
    },
    // 判断两个点是否在一个范围内
    isRange(p, p2, mineare) {
      let result = false;

      // 计算鼠标点与元素点的面积
      const w = Math.abs(p.x - p2.x);
      const y = Math.abs(p.y - p2.y);

      const area = w * w + y * y;

      if (area <= mineare) {
        result = true;
      }

      return result;
    },
    // 动态计算两个点线条的宽度
    getLineWidth(p, p2, minArea) {
      const w = Math.abs(p.x - p2.x);
      const h = Math.abs(p.y - p2.y);
      const area = w * w + h * h;

      // 计算连线宽度
      const lineWidth = (minArea - area) / minArea;
      return lineWidth;
    },
    /**
     *  连接两个点
     * @param {*} p 点1,比如鼠标坐标
     * @param {*} p2 点2,一般为粒子
     * @param {*} minArea 范围
     * @param {*} ctx 绘制的画布
     */
    pointLineToPoint(p, p2, minArea, ctx) {
      const lineWidth = this.getLineWidth(p, p2, minArea);
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = lineWidth || "1";
      ctx.strokeStyle =
        p2.color ||
        `hsl(${utils.random(0, 360)}, ${utils.random(90, 100)}%, 50%)`;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
  };
  window.utils = utils;
})(window);
