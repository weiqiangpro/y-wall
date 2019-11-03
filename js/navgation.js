var token;
var userdata;
var islogin = false;
var isrec = true; //是否显示的是收到的信息

$(document).ready(function () {
    token = GetToken();
    userdata = GetMeMsg(token);
    SetUserMsg(userdata);
    // IsLogin();
    NavbarFit();

    $("#comment-most").click(function () {
        var url = window.location.href;
        var name = url.split("/");
        name = name[name.length - 1];
        if (name.indexOf("hot") !== -1) {
            UpdataByComment();
        } else {
            window.location.href = "hot.html?cato=comment";
        }
    });
    $("#love-most").click(function () {
        var url = window.location.href;
        var name = url.split("/");
        name = name[name.length - 1];
        if (name.indexOf("hot") !== -1) {
            UpdataByLove();
        } else {
            window.location.href = "hot.html?cato=love";
        }
    });
    $("#hot-most").click(function () {
        var url = window.location.href;
        var name = url.split("/");
        name = name[name.length - 1];
        if (name.indexOf("hot") !== -1) {
            UpdataByHot();
        } else {
            window.location.href = "hot.html?cato=hot";
        }
    });

    $(".search-icon").click(function () {
        var mes = $("#search-input").val();
        window.location.href = "search.html?mes=" + mes;
    });
    $("#hot").click(function () {
        window.location.href = "hot.html?cato=love";
    });

    //好友按钮
    $("#friends").click(function () {
        if (islogin) {
            var msg_show = $("#msg").css("display");
            if (msg_show !== "none") {
                $("#msg").css("display", "none");
            }
            var win_height = $(window).height();
            $("#fri").css("height", win_height - 72 + "px");
            $("#fri").css("margin-top", "72px");
            var i = $("#fri").css("display");
            if (i === "block") {
                $("#fri").css("display", "none");
            } else {
                $("#fri").css("display", "block");
            }

            var data = GetMyAttent(token);
            SetAttent(data);
        } else {
            alert_("您未登录");
        }

    });
    //下拉菜单按钮
    $("#drop_btn").click(function () {
        var msg_show = $("#msg").css("display");
        if (msg_show !== "none") {
            $("#msg").css("display", "none");
        }
        var fri_show = $("#fri").css("display");
        if (fri_show !== "none") {
            $("#fri").css("display", "none");
        }
        var win_height = $(window).height();
        var i = $("#more").css("display");
        if (i === "block") {
            $("#more").css("display", "none");
        } else {
            $("#more").css("display", "block");
        }
    });
    //点击回复按钮
    $("#reply").click(function () {
        $("#reply_msg").css("display", "block");
        $("#hr").css("display", "block");
        $("#reply").css("display", "none");
        $("#send").attr("style", "");
    });
    //点击发送按钮
    $("#send").click(function () {
	var msg = $("#reply_msg").val();
	console.log(msg==="");        
if (msg!=="") {
$("#message_modal").modal("hide");
            SendMsg(token, msg, $("#message_modal").attr("userid"));
        } else {
            alert_("发送内容不能为空！");
        }
    });
    //消息按钮
    $("#message").click(function () {
        if (islogin) {
            var data = GetMsg_Receive();
            SetMsg(data);
            var fri_show = $("#fri").css("display");
            if (fri_show !== "none") {
                $("#fri").css("display", "none");
            }
            var win_height = $(window).height();
            $("#msg").css("height", win_height - 72 + "px");
            $("#msg").css("margin-top", "72px");
            var i = $("#msg").css("display");
            if (i === "block") {
                $("#msg").css("display", "none");
            } else {
                $("#msg").css("display", "block");
            }
        } else {
            alert_("您未登录");
        }
    });

    $("#exit").click(function () {
        if (islogin) {
            $.ajax({
                url: "https://www.aoteam.top/api/user/logout.do",
                headers: {
                    Token: token
                },
                success: function (res) {
                    if (res.status === 0) {
                        window.location.href = "index.html";
                    }
                }
            })
        } else
            alert_("您未登录")
    });

    $("#publish").click(function () {
        if (islogin) {
            window.location.href = "publishworks.html";
        } else {
            alert_("您未登录");
        }
    });

    $("#edit").click(function () {
        if (islogin) {
            window.location.href = "edit.html";
        } else {
            alert_("您未登录");
        }
    });
    $("#receive_msg").click(function () {
        isrec = true;
        $("#send_msg").chicked = false;
        var data = GetMsg_Receive();
        SetMsg(data);
    });
    $("#send_msg").click(function () {
        isrec = false;
        $("#receive_msg").chicked = false;
        var data = GetMsg_Send();
        SetMsg(data);
    });
});

window.alert = alert;

function alert(data, url) {
    var hint = $("<div id=\"hint\"></div>");
    var img = $("<img src=\"img/css/提示.png\" style=\"width: 35px; height: 35px;float:left;margin-top: 12%; margin-left: 10%;\"/>");
    var hint_con = $("<div id=\"hint_cont\"></div>");
    var btn = $("<button class=\"btn btn-default\" id=\"hint_confirm\">确认</button>");
    hint_con.append(data);
    img.appendTo(hint);
    hint_con.appendTo(hint);
    btn.appendTo(hint);
    hint.appendTo($("body"));
    var w_height = $(window).height();
    var w_width = $(window).width();
    // var sc_height = $(document).scrollTop();
    hint.css("top", 100 + "px");
    hint.css("left", w_width / 2 - 170 + "px");
    btn.click(function () {
        hint.remove();
        window.location.href = url;
    });
}

window.alert_ = alert_;

function alert_(data) {
    $("#hint").remove();
    var hint = $("<div id=\"hint\"></div>");
    var img = $("<img src=\"img/css/提示.png\" style=\"width: 35px; height: 35px;float:left;margin-top: 12%; margin-left: 10%;\"/>");
    var hint_con = $("<div id=\"hint_cont\"></div>");
    hint_con.append(data);
    img.appendTo(hint);
    hint_con.appendTo(hint);
    hint.appendTo($("body"));
    var w_height = $(window).height();
    var w_width = $(window).width();
    // var sc_height = $(document).scrollTop();
    hint.css("top", 100 + "px");
    hint.css("left", w_width / 2 - 170 + "px");
    setInterval(function () {
        hint.remove();
    }, 2000);
}

//获取Token
function GetToken() {
    var cookie = document.cookie;
    var token;
    if (cookie.indexOf("token=") !== -1) {
        token = cookie.replace("token=", "");
    } else {
        token = "";
    }
    return token;
}

//判断是否登录
function IsLogin() {
    var username = $("#username").val();
    if (username === "未登录") {
        islogin = false;
    } else {
        islogin = true;
    }
}


//获取自己信息
function GetMeMsg(token) {
    var data;
    $.ajax({
        url: "https://www.aoteam.top/api/user/me.do",
        headers: {
            Token: token
        },
        async: false,
        success: function (res) {
            data = res.data;
        }
    });
    return data;
}

//设置导航栏用户信息。
function SetUserMsg(userdata) {
    var username = $("#username");
    var head = $("#head");
    if (userdata === "" || userdata === null) {
        username.append("未登录");
        islogin = false;
        username.attr("href", "index.html");
    } else {
        head.attr("src", userdata.pho);
        username.empty();
        username.append(userdata.userName);
        username.attr("href", "homepage_.html");
        islogin = true;
    }
}

//导航条适配
function NavbarFit() {
    $("#search-input").css("width", 0);
    var input_win = $(".container-fluid").outerWidth() - $(".navbar-header").outerWidth() - $(".navbar-nav").outerWidth() - 80;
    $("#search-input").css("width", input_win + "px");
    $(window).resize(function () {
        $("#search-input").css("width", 0);
        var input_win = $(".container-fluid").outerWidth() - $(".navbar-header").outerWidth() - $(".navbar-nav").outerWidth() - 80;
        $("#search-input").css("width", input_win + "px");
    });
}

//获取关注的人的列表
function GetMyAttent(token) {
    var data;
    $.ajax({
        url: "https://www.aoteam.top/api/user/myfollows.do",
        headers: {
            Token: token
        },
        async: false,
        success: function (res) {
            data = res.data;
        }
    });
    return data;
}

//将获取的关注列表显示
function SetAttent(data) {
    $("#fri").empty();
    $("#fri").append("<h4 style='margin-left: 40%;margin-right: auto;'>关注列表</h4><hr>")
    if (data === "" || data === null) {
        alert_("您未登录");
    } else {
        for (var i = 0; i < data.length; i++) {
            var fri = $("<div class='fri'></div>");
            var fri_head = $("<img style=\"width: 50px;height: 50px;border-radius: 25px;float: left\" src=\"img/14.jpg\"/>");
            var fri_name = $("<a class='fri_name'></a>");
            fri_name.attr("href", "homepage.html?id=" + data[i].userId);
            var fri_sign = $("<div class='fri_sign' style='height: 23px;'></div>");
            fri_head.attr("src", data[i].pho);
            fri_name.append(data[i].name);
            var person = data[i].person;
            if (person.length > 20) {
                person = person.substr(0, 10);
                person = person + "...";
            }
            fri_sign.append(data[i].person);
            fri.append(fri_head);
            fri.append(fri_name);
            fri.append(fri_sign);
            $("#fri").append(fri);
        }
    }
}



//将获取的消息显示
function SetMsg(data) {
    $("#msg-con").empty();
    if (data === "" || data === null) {
        alert_("您未登录");
    } else {
        for (var i = 0; i < data.length; i++) {
            var msg = $("<div class='msg'></div>");
            var head = $("<img style=\"width: 50px; height: 50px; border-radius: 25px;float: left;\">");
            var msg_username = $("<a class='msg-username'></a>");
            var msg_content = $("<div class='msg_content'></div>");
            var del = $("<a class='btn' style='float: right'><span class=\"iconfont_1\">&#xe60e;</span></a>");
            msg.append(head);
            msg.append(msg_username);
            msg.append(del);
            msg.append(msg_content);
            head.attr("src", data[i].pho);
            msg_username.append(data[i].name);
            if(isrec){
                msg_username.attr("href", "homepage.html?id=" + data[i].fromUserId);
            }else{
                msg_username.attr("href", "homepage.html?id=" + data[i].toUserId);
            }
            msg_content.append(data[i].message);
            msg.attr("userid", data[i].fromUserId);
            msg.attr("mesid", data[i].mesId);
            var msgid = data[i].mesId;
            $("#msg-con").append(msg);
            $("#msg-con").append("<hr>");
            var m = data[i].message;
            var name = data[i].name;
            del.click(function () {
                $.ajax({
                    url: "https://www.aoteam.top/api/mes/delete.do/" + msgid,
                    async: false,
                    type: "DELETE",
                    headers: {
                        Token: token
                    },
                    success: function (res) {
                        alert_(res.msg);
                    }
                });
                if (isrec) {
                    $("#receive_msg").checked = true;
                    $("#send_msg").checked = false;
                    var data = GetMsg_Receive();
                    SetMsg(data);
                } else {
                    $("#receive_msg").checked = false;
                    $("#send_msg").checked = true;
                    var data = GetMsg_Send();
                    SetMsg(data);
                }

            });
            msg.click(function () {
                $("#reply_msg").css("display", "none");
                $("#hr").css("display", "none");
                $("#send").css("display", "none");
                $("#reply").css("display", "");
                $(".modal-content .container").empty();
                $(".modal-content .container").append(m);
                $(".modal-content h4").empty();
                if (isrec) {
                    $(".modal-content h4").append("From " + name);
                } else {
                    $(".modal-content h4").append("To " + name);
                }
                $(".modal-content h4").append()
                $("#message_modal").modal("show");
                $("#message_modal").attr("userid", $(this).attr("userid"));
            })
        }
    }
}

//获取登录者收到的全部消息
function GetMsg_Receive() {
    var data;
    $.ajax({
        url: "https://www.aoteam.top/api/mes/getreceive.do",
        headers: {
            Token: token
        },
        async: false,
        success: function (res) {
            data = res.data;
        }
    });
    return data;
}

//获取登录者发送的全部信息
function GetMsg_Send() {
    var data;
    $.ajax({
        url: "https://www.aoteam.top/api/mes/getsend.do",
        headers: {
            Token: token
        },
        async: false,
        success: function (res) {
            data = res.data;
        }
    });
    return data;
}

//发送私信
function SendMsg(token, msg, userid) {
    $.ajax({
        url: "https://www.aoteam.top/api/mes/send.do",
        type: "POST",
        headers: {
            Token: token
        },
        data: {
            "message": msg,
            "userid": userid
        },
        success: function (res) {
            if (res.status === 0) {
                alert_("发送私信成功！");
            } else {
                alert_("发送失败！");
            }
        }
    })
}
