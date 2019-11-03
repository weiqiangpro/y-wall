var time = 60;
var t;
var isusername = false;
var isemail = false;
var ispass = false;
var ispass_con = false;
var win_width = $(window).width();
var win_height = $(window).height();
var cover = $('.all_cover');
cover.css("width", win_width);
cover.css("height", win_height);
$(".main").css("height", win_height);
$("#login_modal").modal("show");
$('.modal-backdrop').css({zIndex: '-1000'});
$("#next").click(function () {
    var username = $("#username").val();
    if(username ==  null ){
        alert("输入不能为空");
    }else {
        $.ajax({
            url: "https://www.aoteam.top/api/user/getemail",
            type: "GET",
            data: {
                "account": username
            },
            success: function (datas) {
                if (datas["status"] === 0) {
                    $('#email').val(datas.msg);
                    $("#next1").css("display", "none");
                    $("#next2").css("display", "");
                    $(".forget1").css("display", "none");
                    $(".forget2").css("display", "");
                } else {
                    alert("账号不存在");
                }
            }
        })
    }
});
$("#pre").click(function () {
    $("#next1").css("display", "");
    $("#next2").css("display", "none");
    $(".forget1").css("display", "");
    $(".forget2").css("display", "none");
});
$("#sendd").click(function () {
    var username = $("#username").val();
    if(username ==  null ){
        alert("输入不能为空");
    }else {
        $.ajax({
            url: "https://www.aoteam.top/api/user/findemail",
            type: "POST",
            data: {
                "account": username
            },
            success: function (datas) {
                if (datas["status"] === 0) {
                    $("#next2").css("display", "none");
                    $("#next3").css("display", "");
                    $(".forget2").css("display", "none");
                    $(".forget3").css("display", "");
                } else {
                    alert(datas.msg);
                }
            }
        })
    }
});
$("#pre2").click(function () {
    $("#next2").css("display", "");
    $("#next3").css("display", "none");
    $(".forget2").css("display", "");
    $(".forget3").css("display", "none");
});
$("#config").click(function () {
    var username = $("#username").val();
    var passwd1 = $("#r_password").val();
    var passwd2 = $("#r_confirmpassword").val();
    var code = $("#code").val();
    if(username ==  null ){
        alert("输入不能为空");
    }else {
        $.ajax({
            url: "https://www.aoteam.top/api/user/findpd",
            type: "PUT",
            data: {
                "account": username,
                "code":code,
                "passwd1":passwd1,
                "passwd2":passwd2
            },
            success: function (datas) {
                if (datas["status"] === 0) {
                    alert(datas.msg);
                    window.location.href = "index.html";
                } else {
                    alert(datas.msg);
                }
            }
        })
    }
})