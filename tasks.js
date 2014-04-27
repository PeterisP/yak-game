
// Task structure:
// name - short name used in status reports
// description - long name used in showing what a dwarf is doing
// animation - text used for spritesheet animation names ("pick" -> "hauler_pick")
// doit(dwarf) - do a tick of that task

var Task_RandomWalk = {
  name : 'Random walk',
  description : "I'm randomly walking around and thinking about booze",
  animation : 'default',
  doit : function(dwarf) {
    if (Math.random() < move_speed) {
      if (Math.random()<0.5){
        dwarf.x -= dwarfstep;
      } else {
        dwarf.x += dwarfstep;
      }
      if (dwarf.x < floormargin) {dwarf.x = floormargin;}
      if (dwarf.x > floorwidth-dwarfwidth-floormargin) {dwarf.x = floorwidth-dwarfwidth-floormargin;}
      if (Math.random() < 0.2) {
        dwarf.task_done(this);
      }
    }
  }
}

function Task_WalkTo(floor, x) {
  //console.log("Start walking: " + floor);
  this.targetfloor = floor;
  this.targetx = x;
  this.name = 'Go to floor '+floor;
  this.description = 'Walking to floor '+floor+' spot '+x;
}
Task_WalkTo.prototype.animation = 'default';
Task_WalkTo.prototype.doit = function(dwarf) {
  if (Math.random() < move_speed) {
    if (dwarf.floor == this.targetfloor) {
      var distance = this.targetx-dwarf.x;
      if (Math.abs(distance) <= dwarfstep) {
        // We've arrived
        dwarf.x = this.targetx;
        dwarf.task_done(this);
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
        var newfloor = dwarf.floor;
        if (dwarf.floor > this.targetfloor)
          {newfloor--;}
        else
          {newfloor++;}
        if (floors[newfloor].contents == floortypes.filled) {
          dwarf.task_fail(this, "Can't go to a floor that's not dug out yet!");
        } else {
          dwarf.floor = newfloor;
        }
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

function Task_DigFloor(floor) {
  this.progress = 0;
  this.floor = floor;
}
Task_DigFloor.prototype.name = 'Dig deeper';
Task_DigFloor.prototype.description = 'Dig a new floor below the last available one';
Task_DigFloor.prototype.work_ticks = 200;
Task_DigFloor.prototype.animation = 'pick';
Task_DigFloor.prototype.doit = function(dwarf) {
  if (dwarf.floor+1 != this.floor) {
    dwarf.task_fail(this, 'not above diggable floor');
    return;
  }

  this.progress++;
  if (this.progress > this.work_ticks) {
    floors[this.floor].set_contents(floortypes.empty);
    dwarf.task_done(this);
  }
}

function Task_UpgradeFloor(targetFloor, type) {
  this.progress = 0;
  this.targetFloor = targetFloor;
  this.type = type;
}
Task_UpgradeFloor.prototype.name = 'Upgrade room';
Task_UpgradeFloor.prototype.description = 'Upgrade room to something more useful';
Task_UpgradeFloor.prototype.work_ticks = 200;
Task_UpgradeFloor.prototype.animation = 'pick';
Task_UpgradeFloor.prototype.doit = function(dwarf) {

  //console.log(event);
  if (dwarf.floor != this.targetFloor) {
    dwarf.task_fail(this, 'wrong room');
    return;
  }

  if (this.type < 0.2) {
    ftype = 2;
  } else if (this.type < 0.4) {
    ftype = 4;
  } else if (this.type < 0.6) {
    ftype = 6;
  } else if (this.type < 0.8) {
    ftype = 8;
  } else {
    ftype = 10;
  }

  this.progress++;
  if (this.progress > this.work_ticks) {
    floors[dwarf.floor].set_contents(ftype);
    dwarf.task_done(this);
  }
}

// ------------- jobs --------

function Job_UpgradeFloor(floor,type) {
  this.name = 'Upgrade floor '+floor;
  this.tasks = [];
  this.tasks.push(new Task_WalkTo(floor, floorwidth / 2));
  this.tasks.push(new Task_UpgradeFloor(floor,type));
  this.dwarf = null;
}

function Job_DigFloor(floor) {
  this.name = 'Dig floor '+floor;
  this.tasks = [];
  this.tasks.push(new Task_WalkTo(floor-1, floorwidth / 2));
  this.tasks.push(new Task_DigFloor(floor));
  this.dwarf = null;
}

function Job_WasteTime() {
  this.name = 'Waste time';
  this.tasks = [];
  this.tasks.push(Task_RandomWalk);
  this.dwarf = null;
}
