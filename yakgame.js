"use strict";

var stage;
var fons;
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
var dwarfstep = 16; // step size in px
var dwarfwidth = 64 // dwarf sprite width

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
    frames: {width:dwarfwidth, height:64},
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
  dwarves[0].add_job(new Job_WalkTo(3,30));

  lblFPS.x = 10;
  lblFPS.y = 10;
  stage.addChild(lblFPS);

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
  this.jobs = [];
  this.update();
  stage.addChild(this.sprite);
  var dwarf = this;
  this.sprite.addEventListener("click", function(event) {
    console.log(dwarf);
    log(dwarf.name + " -> " + dwarf.job.description);
  });
}
Dwarf.prototype.sprite = null;
Dwarf.prototype.name = "Urist McDwarf";
Dwarf.prototype.update = function() {
  var job;
  if (this.jobs.length>0) {
    job = this.jobs[0];
  } else {
    job = Job_RandomWalk;
  }
  job.doit(this);
  this.sprite.x = this.x;
  this.sprite.y = floorstart + (this.floor)*floorheight + floormargin;
}

Dwarf.prototype.add_job = function(job) {
  this.jobs.push(job);
}
Dwarf.prototype.job_done = function(job) {
  log(this.name + ": " + job.name + " done!");
  var job_index = this.jobs.indexOf(job);
  if (job_index > -1) {
    this.jobs.splice(job_index, 1);
  } else {
    log(this.name() + ": finished job that he didn't have...")
  }
}

// Job structure:
// name - short name used in status reports
// description - long name used in showing what a dwarf is doing
// doit(dwarf) - do a tick of that job

var Job_RandomWalk = {
  name : "Random walk",
  description : "I'm randomly walking around and thinking about booze",
  doit : function(dwarf) {
    if (Math.random() < move_speed) {
      if (Math.random()<0.5){
        dwarf.x -= dwarfstep;
      } else {
        dwarf.x += dwarfstep;
      }
      if (dwarf.x < floormargin) {dwarf.x = floormargin;}
      if (dwarf.x > floorwidth-dwarfwidth-floormargin) {dwarf.x = floorwidth-dwarfwidth-floormargin;}
    }
  }
}

function Job_WalkTo(floor, x) {
  this.targetfloor = floor;
  this.targetx = x;
  this.name = "Go to floor "+floor;
  this.description = "Walking to floor "+floor+" spot "+x;
}
Job_WalkTo.prototype.doit = function(dwarf) {
  if (Math.random() < move_speed) {
    if (dwarf.floor == this.targetfloor) {
      var distance = this.targetx-dwarf.x;
      if (Math.abs(distance) <= dwarfstep) {
        // We've arrived
        dwarf.x = this.targetx;
        dwarf.job_done(this);
      } else {
        // make a step towards the target
        var step = dwarfstep * distance/Math.abs(distance);
        dwarf.x += step;
      }
    } else { // Different floor
      // how far until middle of the room?
      var stairs = floorwidth/2-dwarfwidth/2;
      var distance = stairs - dwarf.x;
      if (distance == 0) {
        // change floors
        if (dwarf.floor > this.targetfloor)
          {dwarf.floor--;}
        else
          {dwarf.floor++;}
      } else if (Math.abs(distance) <= dwarfstep) {
        // Move to the stairs
        dwarf.x = stairs;
      } else {
        // make a step towards the stairs;
        var step = dwarfstep * distance/Math.abs(distance);
        dwarf.x += step;
      }
    }
  }
}
