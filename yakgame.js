var stage;
var lblFPS;
var log_area;

var dwarves = [];
var dwarfpics;


var floorstart = 240;
var floorheight = 128;
var floorwidth = 640;
var floormargin = 32;

var floorpics;
var floors = [];

var move_speed = 0.05; // Chance to move at each 60fps tick.


function init() {
  log_area = document.getElementById("log");

  stage = new createjs.Stage("testCanvas");

  fons = new createjs.Bitmap("background.png");
  lblFPS = new createjs.Text("", "20px Arial", "#FF7700");

  floorpics = new createjs.SpriteSheet({
    images: ["telpas.png"],
    frames: {width:640, height:128},
    animations: {
      livingroom:2,
      all:[0,4]
    }
  });

  dwarfpics = new createjs.SpriteSheet({
    images: ["ruukji.png"],
    frames: {width:64, height:64},
    animations: {
      hauler:0,
      warrior:1,
      craftsman:2
    }
  });

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

  floors = [];
  for (var i = 1; i<=4; i++) {
    var floor = new createjs.Sprite(floorpics, "all");
    floor.x = 0;
    floor.y = floorstart + (i-1)*floorheight;
    floor.gotoAndStop(0);
    stage.addChild(floor);
    floors[i] = floor;
  }

  dwarves = [];
  dwarves.push(new Dwarf("hauler", 0,100,"Urists 1"));
  dwarves.push(new Dwarf("warrior", 1,200,"Urists 2"));
  dwarves.push(new Dwarf("craftsman", 2,300,"Urists 3"));

  log("setup done");
}

function handleTick(event) {
  lblFPS.text = createjs.Ticker.getMeasuredFPS().toFixed()+" FPS";

  for (var dwarf_nr in dwarves) {
    var dwarf = dwarves[dwarf_nr];
    dwarf.update();
  }

  stage.update();
}

function stopTicker() {
  createjs.Ticker.reset();
}

function log(text) {
  log_area.value += text + "\n";
}

// Initial position to spawn the dwarf
function Dwarf(pic, floor, x, name) {
  this.sprite = new createjs.Sprite(dwarfpics, pic);
  this.x = x;
  this.floor = floor;
  this.name = name;
  this.job = new Job_RandomWalk();
  this.update();
  stage.addChild(this.sprite);
  dwarf = this;
  this.sprite.addEventListener("click", function(event) {
    console.log(dwarf);
    log(dwarf.name + " -> " + dwarf.job.description);
  });
}
Dwarf.prototype.sprite = null;
Dwarf.prototype.name = "Urist McDwarf";
Dwarf.prototype.update = function() {
  this.job.doit(this);
  this.sprite.x = this.x;
  this.sprite.y = floorstart + (this.floor)*floorheight + floormargin;
}

function Job() {}
Job.prototype.doit = function(dwarf) {
  log("Abstract job called ...");
  log(dwarf);
}
Job_RandomWalk.prototype.name = "Abstract job";
Job_RandomWalk.prototype.description = "This job shouldn't ever be assigned";

function Job_RandomWalk() {}
Job_RandomWalk.prototype.doit = function(dwarf) {
  if (Math.random() < move_speed) {
    if (Math.random()<0.5){
      dwarf.x -= 16;
    } else {
      dwarf.x += 16;
    }
    if (dwarf.x < floormargin) {dwarf.x = floormargin;}
    if (dwarf.x > floorwidth-dwarf.sprite.width-floormargin) {dwarf.x = floorwidth-dwarf.sprite.width-floormargin;}
  }
}
Job_RandomWalk.prototype.name = "Random walk";
Job_RandomWalk.prototype.description = "I'm randomly walking around and thinking about booze";

function Job_WalkTo(floor, x) {
  this.targetfloor = floor;
  this.targetx = x;
}
Job_WalkTo.prototype.doit = function(dwarf) {

}