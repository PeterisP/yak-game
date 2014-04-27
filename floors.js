var floorstart = 240;
var floorheight = 128;
var floorwidth = 640;
var floormargin = 32;

var floorpics;
var floors = [];
var floortypes = {
  surface:-1,
  filled:0,
  empty:1,
  livingroom:2,
  mines:2,
  workshop:3
}

function load_floors() {
  floorpics = new createjs.SpriteSheet({
    images: ['telpas.png'],
    frames: {width:640, height:128},
    animations: {
      all:[0,4]
    }
  });
}


// contents - int code of the contents; level - depth of the floor
function Floor(contents, level) {
  this.contents = contents;
  this.level = level;
  if (contents != floortypes['surface']) {
    this.sprite = new createjs.Sprite(floorpics, 'all');
    this.sprite.x = 0;
    this.sprite.y = floorstart + (level-1)*floorheight;
    this.sprite.gotoAndStop(contents);
    stage.addChild(this.sprite);
    var floor = this;
    this.sprite.addEventListener('click', function(event){floor.action(event)})
  }
}
Floor.prototype.action = function(event) {
//  console.log(event);
  if (this.contents == floortypes.empty) {
    show_jobpane();
  }
}
Floor.prototype.set_contents = function(contents) {
  this.contents = contents;
  this.sprite.gotoAndStop(contents);
}



