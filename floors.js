var floorstart = 240;
var floorheight = 128;
var floorwidth = 640;
var floormargin = 32;

var floorpics;
var floors = [];
var floortypes = {
  surface:-1,
  filled:0,
  empty:2,
  livingroom:4,
  mines:6,
  workshop:8,
  farm:10
}
var ft = [
  {
    name:'solid',
    upgrades:['empty'],
    pic:0
  },
  {
    name:'empty',
    upgrades:['living','mine','work','farm'],
    //action:function() {},
    pic:2
  },
  {
    name:'living',
    upgrades:['living2'],
    pic:4
  },
  {
    name:'living2',
    upgrades:[],
    pic:5
  },
  {
    name:'mine',
    upgrades:['mine2'],
    pic:6
  },
  {
    name:'mine2',
    upgrades:[],
    pic:7
  },
  {
    name:'work',
    upgrades:['work2'],
    pic:8
  },
  {
    name:'work2',
    upgrades:[],
    pic:9
  },
  {
    name:'farm',
    upgrades:['farm2'],
    pic:10
  },
  {
    name:'farm2',
    upgrades:[],
    pic:11
  }
];
var floortypes2 = [
  {name:'raktuve',
   upgrades:[
     {name: 'kruta raktuve 1',
      upgrades:[],
      picture : 456},
     {name: 'kruta raktuve 2',
      upgrades:[],
      pic: 123}
   ],
   picture: 123}
]

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
  console.log(this.contents);
  if (this.contents == floortypes.filled) {
    add_job_to_queue(new Job_DigFloor(this.level));
  } else if (this.contents == floortypes.empty) {
    add_job_to_queue(new Job_UpgradeFloor(this.level, Math.random()));
  }
}
Floor.prototype.set_contents = function(contents) {
  this.contents = contents;
  this.sprite.gotoAndStop(contents);
}



