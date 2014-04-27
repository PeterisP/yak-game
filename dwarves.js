var dwarves = [];
var dwarfpics;

var move_speed = 0.05; // Chance to move at each 60fps tick.
var dwarfstep = 16; // step size in px
var dwarfwidth = 64; // dwarf sprite width

var dwarf_status_panel;
var job_panel;
var job_queue = [];

function load_dwarves() {
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

  job_panel = new createjs.Text('', '20px Arial', '#0');
  job_panel.x = floormargin;
  job_panel.y = 800;
}

function setup_dwarves() {
  dwarves = [];
  dwarves.push(new Dwarf('hauler', 0,100,'Hobodwarf'));
  dwarves.push(new Dwarf('warrior', 0,200,'Urist McDwarf'));
  dwarves.push(new Dwarf('craftsman', 0,300,'Brudax'));
  add_job_to_queue(new Job_DigFloor(1));

  stage.addChild(job_panel);
}

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
  this.currentjob = null;
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
  if (this.tasks.length==0) {
    this.fetch_job();
  }
  task = this.tasks[0];
  if (this.prevtask != task) {
    this.sprite.gotoAndPlay(this.pic+'_'+task.animation);
    this.prevtask = task;
  }
  task.doit(this);
  this.sprite.x = this.x;
  this.sprite.y = floorstart + (this.floor-1)*floorheight + floormargin;
}
Dwarf.prototype.fetch_job = function() {
  possible_jobs = [{job:Job_WasteTime, weight:100}];
  for (job_id in job_queue) {
    if (job_queue[job_id].dwarf == null) {
      var job = job_queue[job_id];
      possible_jobs.push({job:job, weight:job.weight(dwarf)});
      job = job_queue[job_id];
    }
  }
  //var job = weighted_random(possible_jobs);
  job = Task_RandomWalk;
  this.tasks = this.tasks.concat(job.tasks);
      // NB! te ir tas pats task eksemplaars, tas nodroshina puspabeigtu job turpinaashanu
  job.dwarf = this;
  this.currentjob = job;
}
Dwarf.prototype.add_task = function(task) {
  this.tasks.push(task);
}
Dwarf.prototype.task_done = function(task) {
  //if (task == Task_RandomWalk) return;
  //log(this.name + ': ' + task.name + ' done!');
  var task_index = this.tasks.indexOf(task);
  if (task_index > -1) {
    this.tasks.splice(task_index, 1);
    if (this.tasks.length == 0) { // job is done
      job_done(this.currentjob);
      this.currentjob = null;
    }
  } else {
    log(this.name + ": finished a task that he didn't have...");
  }
}
Dwarf.prototype.task_fail = function(task, message) {
  log(this.name + ': ' + task.name + ' failed: ' + message);
  var task_index = this.tasks.indexOf(task);
  if (task_index > -1) {
    this.tasks.splice(task_index, 1);
    if (this.currentjob != null) {
      this.currentjob.dwarf = null; // assign to someone else?
      this.currentjob = null;
    }
  } else {
    log(this.name() + ": failed a task that he didn't have...");
  }
}

function add_job_to_queue(job) {
  log('Queued job :'+job.name);
  job_queue.push(job);
}
function job_done(job) {
  if (job == null) return;
  log(job.name + ' done!');
  var job_index = job_queue.indexOf(job);
  if (job_index > -1) {
    job_queue.splice(job_index, 1);
  } else {
    log(job.name + " - job finished but wasn't in the queue...");
  }
}


function weighted_random(items) {
    var totalWeight = 0;
    // sum up the weights
    for (var i in items) {
        totalWeight += items[i].weight;
    }
    var random = Math.floor(Math.random() * totalWeight);

    // now find which bucket our random value is in
    var cumulativeWeight = 0;
    for (var i in items) {
        cumulativeWeight += items[i].weight;
        if (random < cumulativeWeight) {
            return(items[i]);
        }
    }
}