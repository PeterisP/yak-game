// Initial position to spawn the dwarf
function Dwarf(pic, floor, x, name) {
  this.pic = pic;
  this.sprite = new createjs.Sprite(dwarfpics, pic+'_default');
  this.sprite.framerate = 4;
  this.x = x;
  this.floor = floor;
  this.name = name;
  this.tasks = [];
  this.prevtask = null;
  this.update();
  stage.addChild(this.sprite);
  var dwarf = this;
  this.sprite.addEventListener('click', function(event) {
    console.log(dwarf);
  });
}
Dwarf.prototype.sprite = null;
Dwarf.prototype.name = 'Urist McDwarf';
Dwarf.prototype.update = function() {
  var task;
  if (this.tasks.length>0) {
    task = this.tasks[0];
  } else {
    task = Task_RandomWalk;
  }
  if (this.prevtask != task) {
    this.sprite.gotoAndPlay(this.pic+'_'+task.animation);
    this.prevtask = task;
  }
  task.doit(this);
  this.sprite.x = this.x;
  this.sprite.y = floorstart + (this.floor-1)*floorheight + floormargin;
}

Dwarf.prototype.add_task = function(task) {
  this.tasks.push(task);
}
Dwarf.prototype.task_done = function(task) {
  log(this.name + ': ' + task.name + ' done!');
  var task_index = this.tasks.indexOf(task);
  if (task_index > -1) {
    this.tasks.splice(task_index, 1);
  } else {
    log(this.name() + ": finished a task that he didn't have...");
  }
}
Dwarf.prototype.task_fail = function(task, message) {
  log(this.name + ': ' + task.name + ' failed: ' + message);
  var task_index = this.tasks.indexOf(task);
  if (task_index > -1) {
    this.tasks.splice(task_index, 1);
  } else {
    log(this.name() + ": failed a task that he didn't have...");
  }
}





