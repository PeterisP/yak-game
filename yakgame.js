'use strict';

var stage;
var fons;
var lblFPS;
var log_area;

var dwarves = [];
var dwarfpics;

var move_speed = 0.05; // Chance to move at each 60fps tick.
var dwarfstep = 16; // step size in px
var dwarfwidth = 64 // dwarf sprite width

var jobdialog;
var activedialog = null;
var curtain;

function init() {
  var canvas = document.getElementById('testCanvas');
  log_area = document.getElementById('log');

  stage = new createjs.Stage('testCanvas');
  //var retina = window.devicePixelRatio > 1 ? true : false;
  // if (retina) {
  //     stage.scaleX = stage.scaleY = 0.5;
  //
  //     canvas.style.width = canvas.width / 2 + "px";
  //     canvas.style.height = canvas.height / 2 + "px";
  // }

  fons = new createjs.Bitmap('background.png');
  lblFPS = new createjs.Text('', '20px Arial', '#FF7700');

  load_floors();

  dwarfpics = new createjs.SpriteSheet({
    images: ['ruukji.png'],
    frames: {width:dwarfwidth, height:64},
    animations: {
      hauler_default: [0,1],
      hauler_pick: [2,4],
      warrior_default: 8,
      warrior_pick: [10,12],
      craftsman_default: 16,
      craftsman_pick: [18,20]
    }
  });

  curtain = new createjs.Shape();
  curtain.graphics.beginFill("#000000").drawRect(0,0,canvas.width, canvas.height);
  curtain.alpha = 0.5;

  jobdialog = new createjs.Container();
  var jobbackground = new createjs.Bitmap('jobpane.png');
  jobdialog.addChild(jobbackground);
  var dialogsize = jobbackground.getBounds();
  jobdialog.x = canvas.width/2 - dialogsize.width/2;
  jobdialog.y = canvas.height/2 - dialogsize.height/2;

  setup();
}

function setup() {
  stage.removeAllChildren();
  stage.addChild(fons);

  createjs.Ticker.init();
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener('tick', handleTick);

  floors = [];
  floors[0] = new Floor(floortypes['surface'],0);
  for (var i = 1; i<=4; i++) {
    floors[i] = new Floor(floortypes['filled'], i);
  }

  dwarves = [];
  dwarves.push(new Dwarf('hauler', 0,100,'Urists 1'));
  dwarves.push(new Dwarf('warrior', 0,200,'Urists 2'));
  dwarves.push(new Dwarf('craftsman', 0,300,'Urists 3'));
  dwarves[0].add_task(new Task_WalkTo(3,30));
  dwarves[2].add_task(new Task_DigDeeper());

  curtain.visible = false;
  stage.addChild(curtain);
  jobdialog.visible = false;
  stage.addChild(jobdialog);

  lblFPS.x = 10;
  lblFPS.y = 10;
  stage.addChild(lblFPS);

  log('setup done');
}

function handleTick(event) {
  lblFPS.text = createjs.Ticker.getMeasuredFPS().toFixed()+' FPS';

  for (var dwarf_nr in dwarves) {
    var dwarf = dwarves[dwarf_nr];
    dwarf.update();
  }

  stage.update(event);
}

function stopTicker() {
  createjs.Ticker.reset();
}

function log(text) {
  log_area.value += text + '\n';
}

