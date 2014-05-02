function getPlanFile(url){
    var user_repo = url.split('github.com/')[1].split('.git')[0];
    var planfile;
    $.ajax({
      type: "GET",
      async: false,
      url: "https://api.github.com/repos/" + user_repo + "/contents/planfile.yaml",
      crossdomain: true,
      dataType: "json",
      success: function(data){planfile = atob(data.content);},
      error: function(){planfile = "";},
    });
    return planfile;
}
