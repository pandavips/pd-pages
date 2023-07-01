(function (w, d) {
  // 向环境添加我们自己的css
  const insertCss = (cssText) => {
    const style = d.createElement("style");
    style.innerHTML = cssText;
    const head = d.documentElement.querySelector("head");
    head.appendChild(style);
  };

  w.$typing = function (option) {
    const { selector, words } = option;
    const el = d.querySelector(selector);

    el.style.whiteSpace = "nowrap";
    el.style.overflow = "hidden";
    el.style.borderRight = "4px solid #fff";

    insertCss(
      ".typing {animation: typing 2s steps(13) 2 alternate, effect 0.5s step-end infinite alternate;}@keyframes typing {from {width: 0;}}@keyframes effect {50% {border-color: transparent;}}"
    );

    // 选取词汇的函数
    const getWord = () => {
      return words[Math.floor(Math.random() * words.length)];
    };

    // 开启一轮
    const aniLoop = () => {
      el.classList.contains("typing") && el.classList.remove("typing");
      const word = getWord();
      console.log("开启新一轮,本轮文字:", word);
      el.innerText = word;
      // el.innerText;
      el.style.width = `0`;
      const duration = word.length / 5;
      el.style.animationDuration = `${duration}s,0.5s`;
      el.style.animationTimingFunction = `steps(${word.length + 1}),step-end`;

      setTimeout(() => {
        el.style.width = `${word.length + 1}em`;
        !el.classList.contains("typing") && el.classList.add("typing");
      }, 0);
      return duration * 2 * 1000;
    };

    const time = aniLoop();

    // 判断是否支持webkitAnimationEnd事件
    const isSupportAnimationEnd = "onanimationend" in el;

    // 不支持就开启定时器模式
    if (!isSupportAnimationEnd) {
      let tm = void 0;
      const timerLoop = (t) => {
        console.log("由定时器驱动");
        setTimeout(() => {
          tm = aniLoop();
          timerLoop(tm);
        }, t);
      };
      timerLoop(time);
      return;
    }

    // 支持事件就最好了!
    el.addEventListener("animationend", (e) => {
      if (e.animationName !== "typing") return;
      console.log("由事件驱动");
      aniLoop();
    });
  };
})(window, document);
