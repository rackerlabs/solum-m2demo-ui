var STATUS;
var TICKING = false;
var TICK;
var LAST_STATUS = '';
var CURRENT_STATUS = document.getElementById("currentstatus");
var poll_interval = '';

var BOX_CLONE = document.getElementById("clone");
BOX_CLONE.messages = {
    "": "Clone source code from Github",
    "active": "Cloning source code from Github",
    "passed": "Source code cloned",
}

var BOX_BUILD = document.getElementById("build");
BOX_BUILD.messages = {
    "": "Build application binary from source code",
    "active": "Building application binary from source code",
    "passed": "Application built",
}

var BOX_TEST = document.getElementById("test");
BOX_TEST.messages = {
    "disabled": "Test application (disabled)",
}

var BOX_PACKAGE = document.getElementById("package");
BOX_PACKAGE.messages = {
    "": "Create deployable unit from application binary",
    "active": "Creating deployable unit from application binary",
    "passed": "Deployable unit created",
}

var BOX_TEMPLATE = document.getElementById("template");
BOX_TEMPLATE.messages = {
    "": "Create Heat template",
    "active": "Creating Heat template",
    "passed": "Heat template created",
    "failed": "Failed to create Heat template",
}

var BOX_DEPLOY = document.getElementById("deploy");
BOX_DEPLOY.messages = {
    "": "Deploy application",
    "active": "Deploying application",
    "passed": "Application deployed",
    "failed": "Failed to deploy application",
}

var BOX_COMPLETE = document.getElementById("complete");
BOX_COMPLETE.messages = {
    "": "Application still deploying",
    "passed": "Application ready",
}

function set_box(box, status) {
    box.setAttribute("class", "box " + status);
    box_abbr_id = box.id + '_abbr';
    abbr = document.getElementById(box_abbr_id);
    abbr.setAttribute('title', box.messages[status]);
}

function workflow_tick() {
    var wait = document.getElementById('workflow_tick');
    if (wait.innerHTML.length >= 3) {
        wait.innerHTML = "";
    } else {
        wait.innerHTML += ".";
    }
}

function startTicking() {
    if (!TICKING) {
        TICK = setInterval(workflow_tick, 500);
        TICKING = true;
    }
}

function stopTicking() {
    clearInterval(TICK);
    TICKING = false;
    var wait = document.getElementById('workflow_tick');
    wait.innerHTML = ".";
}

function updateStatus(status) {
    console.log("Updating status to", status);
    switch (status) {
    case 'BUILDING':
        CURRENT_STATUS.innerHTML = BOX_BUILD.messages.active;
        startTicking();
        set_box(BOX_CLONE, 'passed');
        set_box(BOX_BUILD, 'active');
        set_box(BOX_TEST, 'disabled');
        set_box(BOX_PACKAGE, '');
        set_box(BOX_TEMPLATE, '');
        set_box(BOX_DEPLOY, '');
        set_box(BOX_COMPLETE, '');
        break;

    case 'DEPLOYING':
        CURRENT_STATUS.innerHTML = BOX_DEPLOY.messages.active;
        startTicking();
        set_box(BOX_CLONE, 'passed');
        set_box(BOX_BUILD, 'passed');
        set_box(BOX_TEST, 'disabled');
        set_box(BOX_PACKAGE, 'passed');
        set_box(BOX_TEMPLATE, 'passed');
        set_box(BOX_DEPLOY, 'active');
        set_box(BOX_COMPLETE, '');
        break;

    case 'READY':
        CURRENT_STATUS.innerHTML = BOX_COMPLETE.messages.passed;
        stopTicking();
        set_box(BOX_CLONE, 'passed');
        set_box(BOX_BUILD, 'passed');
        set_box(BOX_TEST, 'disabled');
        set_box(BOX_PACKAGE, 'passed');
        set_box(BOX_TEMPLATE, 'passed');
        set_box(BOX_DEPLOY, 'passed');
        set_box(BOX_COMPLETE, 'passed');
        clearInterval(poll_interval);
        break;

    case 'ERROR':
        CURRENT_STATUS.innerHTML = BOX_DEPLOY.messages.failed;
        stopTicking();
        set_box(BOX_CLONE, 'passed');
        set_box(BOX_BUILD, 'passed');
        set_box(BOX_TEST, 'disabled');
        set_box(BOX_PACKAGE, 'passed');
        set_box(BOX_TEMPLATE, 'passed');
        set_box(BOX_DEPLOY, 'failed');
        set_box(BOX_COMPLETE, '');
        clearInterval(poll_interval);
        break;

    case 'ERROR_STACK_CREATE_FAILURE':
        CURRENT_STATUS.innerHTML = BOX_TEMPLATE.messages.failed;
        stopTicking();
        set_box(BOX_CLONE, 'passed');
        set_box(BOX_BUILD, 'passed');
        set_box(BOX_TEST, 'disabled');
        set_box(BOX_PACKAGE, 'passed');
        set_box(BOX_TEMPLATE, 'failed');
        set_box(BOX_DEPLOY, '');
        set_box(BOX_COMPLETE, '');
        clearInterval(poll_interval);
        break;

    case '':
    default:
        CURRENT_STATUS.innerHTML = "Pending";
        stopTicking();
        set_box(BOX_CLONE, '');
        set_box(BOX_BUILD, '');
        set_box(BOX_TEST, 'disabled');
        set_box(BOX_PACKAGE, '');
        set_box(BOX_TEMPLATE, '');
        set_box(BOX_DEPLOY, '');
        set_box(BOX_COMPLETE, '');
        break;
    }

}