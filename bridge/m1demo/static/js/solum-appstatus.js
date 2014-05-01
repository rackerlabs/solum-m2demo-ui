function solum_draw_status(context, states){
  var COLORS = {
      FAILED: "#900",
      PENDING: "#039",
      PASSED: "#090",
      DISABLED: "#ccc",
      DEFAULT: "#000",
    }
  context.clearRect(0, 0, 500, 500);

  context.fillStyle = "transparent";
  context.strokeStyle = COLORS.DEFAULT;
  context.font = "16px Helvetica";

  var icons = [];
  for(var i=0; i<states.length; i++){
    icons.push(new Image());
  }

  for(var i=0; i<states.length; i++){
    var state = states[i];
    var color = COLORS.DEFAULT;
    switch(state.status){
      case 'PASSED':
        color = COLORS.PASSED;
        break;
      case 'FAILED':
        color = COLORS.FAILED;
        break;
      case 'PENDING':
        color = COLORS.PENDING;
        break;
      case 'DISABLED':
        color = COLORS.DISABLED;
        break;
      default:
        color = COLORS.DEFAULT;
    }
    context.fillStyle = color;
    context.strokeStyle = color;

    context.lineWidth = "4";
    var xoffset = 10 + (i * 100);
    context.strokeRect(xoffset, 20, 60, 60);
    context.lineWidth = "0";
    context.fillText(state.name, xoffset, 95);

    var icon = icons[i];
    icon.src = '/static/images/' + state.img + '.png';
    icon.xoff = 10 + (100 * i);
    icon.onload = function(k) {
        return function(){
          context.drawImage(k, k.xoff, 20, 60, 60);
        }
    }(icon);
  }

  context.fillStyle = COLORS.DEFAULT;
  context.strokeStyle = COLORS.DEFAULT;
  for(var i=0; i<states.length-1; i++){
    var x = 80 + (100 * i);
    context.beginPath();
    context.arc(x,      50, 3, 0, 2*Math.PI);
    context.arc(x + 10, 50, 3, 0, 2*Math.PI);
    context.fill();
    context.beginPath()
    context.moveTo(x + 17, 45);
    context.lineTo(x + 27, 50);
    context.lineTo(x + 17, 55);
    context.closePath();
    context.fill();
  }


}

function build_status(string){
    var S = [
        {
            'name': 'Git',
            'img': 'download-icon',
        },
        {
            'name': 'Build',
            'img': 'wrench',
        },
        {
            'name': 'Test',
            'img': 'lab-beaker-icon',
            'status': 'DISABLED',
        },
        {
            'name': 'Image',
            'img': 'paper-icon',
        },
        {
            'name': 'Template',
            'img': 'setting-icon',
        },
    ];
    switch(string){
        case 'PENDING':
            break;
        case 'BUILDING':
            S[0].status = 'PASSED';
            S[1].status = 'PENDING';
            break;
        case 'DEPLOYING':
            S[0].status = 'PASSED';
            S[1].status = 'PASSED';
            S[3].status = 'PASSED';
            S[4].status = 'PASSED';
            break;
        case 'READY':
            S[0].status = 'PASSED';
            S[1].status = 'PASSED';
            S[3].status = 'PASSED';
            S[4].status = 'PASSED';
            break;
        case 'ERROR':
            S[0].status = 'PASSED';
            S[1].status = 'PASSED';
            S[3].status = 'PASSED';
            S[4].status = 'PASSED';
            break;
        case 'ERROR_STACK_CREATE_FAILED':
            S[0].status = 'PASSED';
            S[1].status = 'PASSED';
            S[3].status = 'PASSED';
            S[4].status = 'PASSED';
            break;
    }

    return S;  
}

function deploy_status(string){
    var S = [
        {
            'name': 'Start',
            'img': 'download-icon',
        },
        {
            'name': 'Heat',
            'img': 'fire-icon',
        },
        {
            'name': 'Complete',
            'img': 'browser-icon',
        },
    ];
    switch(string){
        case 'DEPLOYING':
            S[0].status = 'PASSED';
            S[1].status = 'PENDING';
            break;
        case 'READY':
            S[0].status = 'PASSED';
            S[1].status = 'PASSED';
            S[2].status = 'PASSED';
            break;
        case 'ERROR':
            S[0].status = 'PASSED';
            S[1].status = 'FAILED';
            break;
        case 'ERROR_STACK_CREATE_FAILED':
            S[0].status = 'FAILED';
            break;
    }

    return S;  
}



function update_status(status_string) {
  var stat = build_status(status_string);
  var canv = document.getElementById("buildstatus");
  if (canv.getContext){
    var context = canv.getContext("2d");
    solum_draw_status(context, stat);
  }

  stat = deploy_status(status_string);
  var canv = document.getElementById("deploystatus");
  if (canv.getContext){
    var context = canv.getContext("2d");
    solum_draw_status(context, stat);
  }
}
