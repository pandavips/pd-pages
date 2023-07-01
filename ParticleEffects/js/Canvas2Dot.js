/**
 * 该类负责将canvas上像素点转换为坐标点以及颜色信息
 *
 * @author panda
 */
class Canvas2Dot {
  constructor(option = {}) {
    const { width = window.innerWidth, height = window.innerHeight } = option;
    this.canvas = null;
    this.ctx = null;
    this.init(width, height);
  }

  init(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("cache-canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");
  }

  // 扫描文字
  createWord(params) {
    const { words, color = "#fff", size = 40, x = 50, y = 50 } = params;
    const ctx = this.ctx;
    // 画板可能多次使用,所以需要清除先前的文字
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    ctx.beginPath();
    ctx.font = `bold ${size}px Helvetica`;
    ctx.fillStyle = color;
    ctx.fillText(words, x, y);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    //记录当前文字的位置，方便缩小扫描范围
    this.x = x;
    this.y = y;
    this.size = size;
    this.length = words.length;
  }
  getDotPiontDataByWord(params) {
    this.createWord(params);

    const xStart = this.x,
      xEnd = this.x + this.length * this.size,
      yStart = 0;
    // yEnd = this.y + this.size;
    // 由于数据量庞大,尽量减小扫描范围
    const data = this.ctx.getImageData(
      xStart,
      yStart,
      this.length * this.size,
      this.size * 1.5
    ).data;
    const positions = [];
    let x = xStart,
      y = yStart;
    const gap = 2; //隔2个像素点扫描,进一步缩小数据量,但是值不宜过高,看自己权衡
    for (var i = 0; i < data.length; i += 4 * gap) {
      if (data[i + 3] > 0) {
        const color = `rgba(${data[i]},${data[i + 1]},${data[i + 2]},${
          data[i + 3]
        })`;
        positions.push({ x, y, color });
      }
      x += gap;
      if (x >= xEnd) {
        y += gap;
        x = xStart;
        i += 2 * gap * (xEnd - xStart);
      }
    }
    return positions;
  }

  // 扫描图片
  createImg(params) {
    const { img, x = 0, y = 0 } = params;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(img, x, y);
    ctx.closePath();
    ctx.restore();
    this.x = x;
    this.y = y;
  }
  getDotPiontDataByImg(params) {
    this.createImg(params);
    const xStart = this.x,
      yStart = this.y,
      xEnd = this.x + params.img.width,
      yEnd = this.y + params.img.height;
    const data = this.ctx.getImageData(
      xStart,
      yStart,
      params.img.width,
      params.img.height
    ).data;
    const positions = [];
    let x = xStart,
      y = yStart;
    const gap = 4;
    for (var i = 0; i < data.length; i += 4 * gap) {
      if (data[i + 3] > 0) {
        const color = `rgba(${data[i]},${data[i + 1]},${data[i + 2]},${
          data[i + 3]
        })`;
        positions.push({ x, y, color });
      }
      x += gap;
      if (x >= xEnd) {
        y += gap;
        x = xStart;
        i += 4 * gap * (xEnd - xStart);
      }
    }
    return positions;
  }

  getCanvas() {
    return this.canvas;
  }

  getContext() {
    return this.ctx;
  }
}
