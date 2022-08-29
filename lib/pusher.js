const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1470218",
  key: "be95caf130c6b2f98d79",
  secret: "e3c68e1455bd43e70642",
  cluster: "ap1",
  useTLS: true,
});

module.exports = pusher;
