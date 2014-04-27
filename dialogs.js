var jobdialog;
var activedialog = null;
var curtain;

function load_dialogs() {
  var canvas = document.getElementById('testCanvas');

  curtain = new createjs.Shape();
  curtain.graphics.beginFill("#000000").drawRect(0,0,canvas.width, canvas.height);
  curtain.alpha = 0.5;

  jobdialog = new createjs.Container();
  var jobbackground = new createjs.Bitmap('jobpane.png');
  jobdialog.addChild(jobbackground);
  //var dialogsize = jobbackground.getBounds();
  var dialogsize = new createjs.Rectangle(0,0,640,640);
  jobdialog.x = canvas.width/2 - dialogsize.width/2;
  jobdialog.y = canvas.height/2 - dialogsize.height/2;

  var jobclose = new createjs.Sprite(stuff_images, 'close');
  jobclose.addEventListener('click', close_jobdialog);
  jobclose.x = dialogsize.width-100;
  jobclose.y = 15;
  jobdialog.addChild(jobclose);
}

function show_floor_upgrade(floor) {
  curtain.visible = true;
  jobdialog.visible = true;
  jobdialog.active_floor = floor;
}

function close_jobdialog() {
  curtain.visible = false;
  jobdialog.visible = false;
  dwarves[1].add_task(new Task_UpgradeFloor(1));

}
