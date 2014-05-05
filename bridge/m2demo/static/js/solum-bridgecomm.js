function listApps() {
    var apps;
    $.ajax({
      type: "GET",
      async: false,
      url: "http://192.168.76.11:9001/solum/apps",
      crossdomain: true,
      dataType: "json",
      success: function(data){apps = data.apps;}
    });
    console.log("Apps:", apps);
    return apps;
}

function getApp(uuid) {
    var app;
    $.ajax({
      type: "GET",
      async: false,
      url: "http://192.168.76.11:9001/solum/apps/" + uuid,
      crossdomain: true,
      dataType: "json",
      success: function(data){app = data.app;}
    });
    console.log("App:", app);
    return app;
}

function createApp(plan_file) {
    var app;
    var app_data = {'planfile': plan_file};
    $.ajax({
      type: "POST",
      async: false,
      url: "http://192.168.76.11:9001/solum/apps/new",
      data: app_data,
      crossdomain: true,
      dataType: "json",
      success: function(data){app = data.app;}
    });
    console.log("App:", app);
    return app;
}

function listAssemblies() {
    var assemblies;
    $.ajax({
      type: "GET",
      async: false,
      url: "http://192.168.76.11:9001/solum/assemblies",
      crossdomain: true,
      dataType: "json",
      success: function(data){assemblies = data.assemblies;}
    });
    console.log("Assemblies:", assemblies);
    return assemblies;
}

function getAssembly(uuid) {
    var assembly;
    $.ajax({
      type: "GET",
      async: false,
      url: "http://192.168.76.11:9001/solum/assemblies/" + uuid,
      crossdomain: true,
      dataType: "json",
      success: function(data){assembly = data.assembly;}
    });
    console.log("Assembly:", assembly);
    return assembly;
}

function createAssembly(app_uri, assembly_name) {
    var assembly;
    var assembly_data = {'plan_uri': app_uri, 'assembly': assembly_name};
    $.ajax({
      type: "POST",
      async: false,
      url: "http://192.168.76.11:9001/solum/assemblies/new",
      data: assembly_data,
      crossdomain: true,
      dataType: "json",
      success: function(data){assembly = data.assembly;}
    });
    console.log("Assembly:", assembly);
    return assembly;
}

function popAppList() {
    // Populate the Application (not App/Plan) list of index.html
    var apps = listAssemblies();
    var text = "";

    for(var i=0; i < apps.length; i++){
        var app = apps[i];
        var appd = getAssembly(app.uuid);
        var apptext = "<tr>\n<th>" + (i + 1) + "</th>\n";
        //var apptext = "<tr>\n<th>" + app.uuid + "</th>\n";
        apptext += "<td>" + app.name + "</td>\n";
        apptext += "<td>" + app.status + "</td>\n";
        apptext += "<td>" + appd.application_uri + "</td>\n";
        apptext += '<td>\n <button class="btn btn-mini btn-sm" style="width:30%">Update</button>\n <button class="btn btn-danger btn-sm" style="width:30%">Manage</button>\n </td>\n<tr>\n';
        text = text + apptext;
    }

    $("#AppList").html(text);
}

function popListApps() {
    var apps = listApps();
    var text = "";
    for(var i=0; i < apps.length; i++){
        var app = apps[i];
        var appline = app.name + " (" + app.description + ") " + app.uuid + "\n";
        text = text + appline;
    }
    $("textarea#listapps").val(text);
}

function popGetApp() {
    var uuid = $("#app_uuid").val();
    var app = getApp(uuid);
    var text = app.name + " (" + app.description + ") " + app.uri;
    $("textarea#getapp").val(text);
    popListApps();
}

function popCreateApp() {
    var plan_file = $("#plan_file").val();
    var app = createApp(plan_file);
    var text = app.name + " (" + app.description + ") " + app.uri;
    $("textarea#getapp").val(text);
    popListApps();
}

function popListAssemblies() {
    var assemblies = listAssemblies();
    var text = "";
    for(var i=0; i < assemblies.length; i++){
        var assembly = assemblies[i];
        var assemblyline = assembly.name + " [" + assembly.status + "] " + assembly.uuid + "\n";
        text = text + assemblyline;
    }
    $("textarea#listassemblies").val(text);
}

function popGetAssembly() {
    var uuid = $("#assembly_uuid").val();
    var assembly = getAssembly(uuid);
    var text = assembly.name + " (" + assembly.status + ") " + assembly.application_uri;
    $("textarea#getassembly").val(text);
    popListAssemblies();
}

function popCreateAssembly() {
    var app_uri = $("#app_uri").val();
    var assembly_name = $("#assembly_name").val();
    var assembly = createAssembly(app_uri, assembly_name);
    var text = assembly.name + " (" + assembly.status + ") " + assembly.application_uri;
    $("textarea#getassembly").val(text);
    popListAssemblies();
}


