var time = 60;
var t;
var isusername = false;
var isemail = false;
var ispass = false;
var ispass_con = false;


$(document).ready(function () {
    var win_width = $(window).width();
    var win_height = $(window).height();
    var cover = $('.all_cover');
    cover.css("width", win_width);
    cover.css("height", win_height);
    $(".main").css("height", win_height);
    var cols = SetCenter(".main",".img");
    ImgPosition(".main",".img",cols);

});


$("#login_btn").click(function () {
    $('#Center_text').css("display", "none");
    $('#login_modal').modal("show");
    $('.modal-backdrop').css({ zIndex: '-1000' });
});

$("#tourist_btn").click(function () {
    window.location.href = "new.html?identity=tourist";
});

$("#register_btn").click(function () {
    $('#Center_text').css("display", "none");
    $('#register_modal').modal("show");
    $('.modal-backdrop').css({ zIndex: '-1000' });
});
//易班登录
$("#yibanlogin").click(function () {
    window.open('https://www.aoteam.top/api/YB/login', '_blank', 'width=500,height=500,top=100,left=200');
});
//易班登录
function yblogin(token, issuccess) {
    if (issuccess === 1) {
        alert_("登录失败");
    } else {
        var mes = "token=" + token;
        document.cookie = mes;
        console.log(document.cookie);
        window.location.href = "/new.html";
    }
};
// 登录关闭
$("#login_close").click(function () {
    $('#Center_text').css("display", "block");
});
//注册关闭
$("#register_close").click(function () {
    $('#Center_text').css("display", "block");
});
//规约
$("#terms").click(function () {
    $("#terms_modal").modal("show");
    $('.modal-backdrop').css({ zIndex: '-1000' });
});
//登录
$("#login").click(function () {
    var username = $("#username").val();
    var passward = $("#password").val();
    if (username == null || passward == null) {

    } else {
        var data = {
            "user": username,
            "passwd": passward
        };
        $.ajax({
            url: "https://www.aoteam.top/api/login",
            type: "POST",
            data: data,
            success: function (datas) {
                if (datas["status"] === 0) {
                    var token = "token=" + datas.data.Token;
                    document.cookie = token;
                    window.location.href = "new.html";
                } else {
                    var error = $("#error_msg");
                    error.empty();
                    error.append("密码错误");
                }
            }
        })
    }
});

function ver_bt_ji() {
    if (time === 0) {
        time = 60;
        $("#ver_btn").attr("disabled", false);
        $("#ver_btn").empty();
        $("#ver_btn").append("发送验证码");
        $("#ver_btn").css("background-color", "");
        clearInterval(t);
    } else {
        $("#ver_btn").empty();
        $("#ver_btn").append(time + "s");
        time--;
    }
}

//发送验证码
$("#ver_btn").click(function () {
    // alert("hh");
    if (isusername && isemail && ispass_con && ispass) {
        $(this).next().remove();
        var email = $("#r_email").val();
        var account = $("#r_username").val();
        var data = {
            "email": email,
            "account": account
        };
        $.ajax({
            url: "https://www.aoteam.top/api/user/registeremail",
            type: "POST",
            data: data,
            async: false,
            success: function (res) {
                if (res.status === 0) {
                }
            }
        });
        $("#ver_btn").attr("disabled", true);
        $("#ver_btn").css("background-color", "grey");
        t = setInterval("ver_bt_ji()", 1000);
    } else {
        $(this).nextAll().remove();
        $(this).after("<br><small style='color: red; font-size: 10px;'> 输入信息不合法</small>")
    }
});
//判断用户名合法
function isregister() {
    var username = $("#r_username").val();
    $.ajax({
        url: "https://www.aoteam.top/api/user/isregister",
        data: {
            account: username
        },
        success: function (res) {
            if (res.msg === "该账号可以注册") {
                $("#r_username+span").empty();
                $("#r_username+span").append("&#xe516;");
                $("#r_username+span").css("display", "");
                $("#r_username+span").nextAll().remove();
                isusername = true;
            } else {
                isusername = false;
                $("#r_username+span").empty();
                $("#r_username+span").append("&#xe64a;");
                $("#r_username+span").css("display", "none");
                $("#r_username+span").nextAll().remove();
                $("#r_username+span").after("<small style='color: red; font-size: 10px;'> " + res.msg + "</small>");
            }
        }
    })
}
//邮箱格式检查
function emailcheck() {
    var email = $("#r_email").val();
    var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
    if (myReg.test(email)) {
        isemail = true;
        $("#r_email+span").empty();
        $("#r_email+span").append("&#xe516;");
        $("#r_email+span").css("display", "");
        $("#r_email+span").nextAll().remove();
    } else {
        isemail = false;
        $("#r_email+span").empty();
        $("#r_email+span").append("&#xe64a;");
        $("#r_email+span").css("display", "none");
        $("#r_email+span").nextAll().remove();
        $("#r_email+span").after("<small style='color: red; font-size: 10px;'> 邮箱格式错误</small>");
    }
}
//密码验证
function password() {
    var password = $("#r_password").val();
    if (password.length >= 6) {
        ispass = true;
        $("#r_password+span").empty();
        $("#r_password+span").append("&#xe516;");
        $("#r_password+span").css("display", "");
        $("#r_password+span").nextAll().remove();
    } else {
        ispass = false;
        $("#r_password+span").empty();
        $("#r_password+span").append("&#xe64a;");
        $("#r_password+span").css("display", "none");
        $("#r_password+span").nextAll().remove();
        $("#r_password+span").after("<small style='color: red; font-size: 10px;'> 密码过于简单</small>");
    }
}
//确认密码验证
function password_firm() {
    var password = $("#r_password").val();
    var password_ = $("#r_confirmpassword").val();
    if (password === password_) {
        ispass_con = true;
        $("#r_confirmpassword+span").empty();
        $("#r_confirmpassword+span").append("&#xe516;");
        $("#r_confirmpassword+span").css("display", "");
        $("#r_confirmpassword+span").nextAll().remove();
    } else {
        ispass_con = false;
        $("#r_confirmpassword+span").empty();
        $("#r_confirmpassword+span").append("&#xe64a;");
        $("#r_confirmpassword+span").css("display", "none");
        $("#r_confirmpassword+span").nextAll().remove();
        $("#r_confirmpassword+span").after("<small style='color: red; font-size: 10px;'> 密码不一致</small>");
    }
}

//注册按钮
$("#register").click(function () {
    var username = $("#r_username").val();
    var email = $("#r_email").val();
    var password = $("#r_password").val();
    var password_ = $("#r_confirmpassword").val();
    var terms = document.getElementById("terms_input").checked;
    var ver = $("#ver").val();
    if (terms === false) {
        alert("您未选中条款选项");
    } else {
        // if()
        var data = {
            "account": username,
            "passwd1": password,
            "passwd2": password_,
            "email": email,
            "code": ver
        };
        if (password === password_) {
            $.ajax({
                url: "https://www.aoteam.top/api/user/register",
                type: "POST",
                data: data,
                success: function (datas) {
                    if (datas.status === 0) {
                        alert("注册成功！")
                    }
                }
            })
        }
    }
})
//忘记密码
$("#forgetpass").click(function () {
    window.location.href = "forget.html";
})



$(window).resize(function () {
    var cols = SetCenter(".main",".img");
    ImgPosition(".main",".img",cols);
});




// 返回数组中最小的元素的索引
function GetMinIndex(array) {
    var min = array[0];
    var index = 0;
    for(var i = 1;i<array.length;i++){
        if(array[i]<min){
            min = array[i];
            index = i;
        }
    }
    return index;
}

// 照片定位,瀑布流布局
function ImgPosition(parent, child, cols) {
    var allbox = $(parent).find(child);
    var heightArr = [];
    var box;
    var box_height;
    var minindex;
    var minheight;
    var mainmargin = parseFloat($(parent).css("margin-left"));
    for(var i = 0;i < allbox.length; i++){
        var j = i+1;
        box = $(allbox[i]);
        box_height = box.outerHeight();
        if (i < cols) {
            heightArr.push(box.outerHeight());
        }else{

            minindex = GetMinIndex(heightArr);

            minheight = heightArr[minindex];

            box.css("position","absolute");
            box.css("left",minindex*box.outerWidth()+mainmargin+"px");
            box.css("top",minheight+"px");
            heightArr[minindex] = minheight+box_height;
        }
    }
}

function SetCenter(parent, child) {
    var boxchild = $(parent).find(child+":first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    var main = $(parent);
    main.width(boxwidth*cols);
    main.css("margin","0 auto");
    return cols;
}