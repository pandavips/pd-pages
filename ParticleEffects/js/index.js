(() => {
  const universe = new PanDa({
    rule: {
      num_dot: 66,
      // num_dot: 0
    },
    data: {
      canvas: document.getElementById("canvas"),
    },
  });
  universe.run();

  // 接入websocket
  const socket = new WebSocket("ws://101.200.220.169:8080/");

  //接受websocket服务的消息
  socket.addEventListener("message", (msg) => {
    universe.acceptHigherDimensional(msg.data);
  });

  document.getElementById("alien").addEventListener("change", (e) => {
    const value = e.target.value;
    if (!value) return;
    socket.send(value);
    e.target.value = "";
  });
})();
