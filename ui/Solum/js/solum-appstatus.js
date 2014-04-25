function draw_status(context, name, current, xoffset){
  var FAILED = "#900";
  var PENDING = "#039";
  var PASSED = "#090";
  var BLACK = "#000";
  var DISABLED = "#ccc";

  context.fillStyle = "transparent";
  context.strokeStyle = BLACK;
  context.lineWidth = "2";
  context.font = "16px Helvetica";

  switch(current){
    case 'ok':
      context.fillStyle = PASSED;
      context.strokeStyle = PASSED;
    break;
    case 'pending':
      context.fillStyle = PENDING;
      context.strokeStyle = PENDING;
    break;
    case 'error':
      context.fillStyle = FAILED;
      context.strokeStyle = FAILED;
    break;
    case 'disabled':
      context.fillStyle = DISABLED;
      context.strokeStyle = DISABLED;
    break;
    default:
      context.fillStyle = BLACK;
      context.strokeStyle = BLACK;
  }
  context.lineWidth = "2";
  context.strokeRect(10 + xoffset, 20, 60, 60);
  context.lineWidth = "0";
  context.fillText(name, 10 + xoffset, 95);
}

function update_status(context, stat) {
  console.log("Updating status to " + stat + ".")
  context.clearRect(0, 0, 500, 100);
  var BLACK = "#000";

  draw_status(context, 'git', stat.git, 0);
  draw_status(context, 'build', stat.build, 100);
  //draw_status(context, 'test', stat.test, 200);
  draw_status(context, 'test', 'disabled', 200);
  draw_status(context, 'image', stat.image, 300);
  draw_status(context, 'template', stat.template, 400);

  //draw four arrows between the states
  context.fillStyle = "#000";
  context.strokeStyle = "#000";
  for(var i=80; i<=400; i+=100){
    context.beginPath();
    context.arc(i,      50, 3, 0, 2*Math.PI);
    context.arc(i + 10, 50, 3, 0, 2*Math.PI);
    //context.arc(i + 20, 50, 3, 0, 2*Math.PI);
    context.fill();
    context.beginPath()
    context.moveTo(i + 17, 45);
    context.lineTo(i + 27, 50);
    context.lineTo(i + 17, 55);
    context.closePath();
    context.fill();
  }

}

function build_status(stat){
  console.log("Stat is " + stat);
  var all = {};

  switch(stat){
    case 'git':
      all.git = 'pending';
      break;
    case 'git_error':
      all.git = 'error';
      break;

    case 'build':
      all.git = 'ok';
      all.build = 'pending';
      break;
    case 'build_error':
      all.git = 'ok';
      all.build = 'error';
      break;

    case 'test':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'pending';
      break;
    case 'test_error':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'error';
      break;

    case 'image':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'ok';
      all.image = 'pending';
      break;
    case 'image_error':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'ok';
      all.image = 'error';
      break;

    case 'template':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'ok';
      all.image = 'ok';
      all.template = 'pending';
      break;
    case 'template_error':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'ok';
      all.image = 'ok';
      all.template = 'error';
      break;

    case 'done':
      all.git = 'ok';
      all.build = 'ok';
      all.test = 'ok';
      all.image = 'ok';
      all.template = 'ok';
      break;

    default:
      all.git = '';
      all.build = '';
      all.test = '';
      all.image = '';
      all.template = '';
      break;
  }
  console.log(all);
  return all;
}

function popStatus() {
  var stat = $("#appstatus").val();
  stat = build_status(stat);
  var canv = document.getElementById("status");
  if (canv.getContext){
    var context = canv.getContext("2d");
    update_status(context, stat);
  }
}

function initialStatus() {
  console.log("Setting initial status.")
  var stat = "none";
  var canv = document.getElementById("status");
  if (canv.getContext){
    var context = canv.getContext("2d");
    update_status(context, stat);
  }
}
