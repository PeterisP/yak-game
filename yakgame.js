var stage;
var lblFPS;
var log_area;

function init() {
  log_area = document.getElementById("log");

  stage = new createjs.Stage("testCanvas");

  fons = new createjs.Bitmap("http://placekitten.com/640/960");
  lblFPS = new createjs.Text("", "20px Arial", "#FF7700");

  setup();
}

function setup() {
  stage.removeAllChildren();
  stage.addChild(fons);
  lblFPS.x = 10;
  lblFPS.y = 10;
  stage.addChild(lblFPS);

  createjs.Ticker.init();
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", handleTick);

  log("setup done");
}

function handleTick(event) {
  lblFPS.text = createjs.Ticker.getMeasuredFPS().toFixed()+" FPS";
  stage.update();
}

function stopTicker() {
  createjs.Ticker.reset();
}

function log(text) {
  log_area.value = text;
}
