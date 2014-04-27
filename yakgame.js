'use strict';

var stage;
var fons;
var lblFPS;
var log_area;

var stuff_images;

function init() {
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
  load_dwarves();

  stuff_images = new createjs.SpriteSheet({
    images: ['80x80_stuff.png'],
    frames: {width:80, height:80},
    animations: {
      stairs: 0,
      pauseplay: [4,5],
      close:6
    }
  });

  load_dialogs();

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

  setup_dwarves();

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

  var job_description = "";
  for (var job_nr in job_queue) {
    var dwarfname = '';
    if (job_queue[job_nr].dwarf != null) {dwarfname = job_queue[job_nr].dwarf.name;}
    job_description += job_queue[job_nr].name + ': ' + dwarfname + '\n';
  }
  job_panel.text = job_description;

  stage.update(event);
}

function stopTicker() {
  createjs.Ticker.reset();
}

function log(text) {
  log_area.value += text + '\n';
}

