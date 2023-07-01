class Vortex {
  constructor(option) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = option.ctx || null;
    this.img = null;
    this.init();
  }
  async init() {
    await this.loadImg();
  }
  async render(option) {
    const point = option.point;
    const ctx = this.ctx;
    const imgScale = 4;
    ctx.save();
    ctx.beginPath();
    const { x, y } = point;
    ctx.arc(x, y, 66, 0, Math.PI * 2);
    ctx.strokeText = "我是黑洞";
    ctx.font = "18px '微软雅黑'";
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.clip();
    ctx.beginPath();
    // ctx.translate(-this.img.width / imgScale / 2, -this.img.height / imgScale / 2);
    // ctx.translate(x, y);
    // ctx.drawImage(this.img, x, y, img.width / imgScale, this.img.height / imgScale);
    ctx.translate(x, y);
    this.update(ctx);
    ctx.drawImage(
      this.img,
      0 - this.img.width / imgScale / 2,
      0 - this.img.height / imgScale / 2,
      this.img.width / imgScale,
      this.img.height / imgScale
    );
    ctx.closePath();
    ctx.restore();
  }

  update(ctx) {
    const timeArr = String(Date.now()).split("");
    const num = timeArr.slice(timeArr.length - 3, timeArr.length).join("");
    const angle = Math.ceil((num / 999) * 360);
    ctx.rotate((angle * Math.PI) / 180);
  }

  loadImg() {
    return new Promise((reslove, reject) => {
      const img = new Image();
      img.src = "./img/xw2.jpg";
      img.onload = () => {
        this.img = img;
        reslove(img);
      };
    });
  }
}
