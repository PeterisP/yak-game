
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
    }
  }
}

function Task_WalkTo(floor, x) {
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

function Task_DigDeeper() {
  this.progress = 0;
}
Task_DigDeeper.prototype.name = 'Dig deeper';
Task_DigDeeper.prototype.description = 'Dig a new floor below the last available one';
Task_DigDeeper.prototype.work_ticks = 300;
Task_DigDeeper.prototype.animation = 'pick';
Task_DigDeeper.prototype.doit = function(dwarf) {
  var diggable_floor = null;
  for (var i in floors) {
    if (floors[i].contents == floortypes.filled) {
      diggable_floor = floors[i];
      break;
    }
  }
  if (diggable_floor == null) {
    dwarf.task_fail(this, 'no diggable floors found');
    return;
  }
  if (dwarf.floor+1 != diggable_floor.level) {
    dwarf.task_fail(this, 'not above diggable floor');
    return;
  }

  this.progress++;
  if (this.progress > this.work_ticks) {
    diggable_floor.set_contents(floortypes.empty);
    dwarf.task_done(this);
  }
}
