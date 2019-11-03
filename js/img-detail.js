var imgid;
var imgdata;
$(document).ready(function () {
    imgid = GetIdFromUrl();

    //获取图片信息
    $.ajax({
        url: "https://www.aoteam.top/api/article/getbyid/"+imgid,
        headers:{
          Token:token
        },
        type: "GET",
        async: false,
        success: function (datas) {
            imgdata = datas["data"];
            if (datas.data.isfollow) {
                $("#attent-btn-t").css("display", "none");
                $("#attent-btn-f").css("display", "block");
            }
        }
    });

    //初始化评论数量
    $("#comment-num").empty();
    $("#comment-num").append(imgdata.commentNum + "条");

    //初始化点赞按钮状态
    if (imgdata.isgood === false) {
        $("#love-btn").empty();
        $("#love-btn").append("<span class=\"iconfont love\" style=\"float: none;color: darkgrey\">&#xe61a; </span>喜欢");
    } else {
        $("#love-btn").empty();
        $("#love-btn").append("<span class=\"iconfont love\" style=\"float: none;color: red\">&#xe61a; </span>取消喜欢");
    }

    var homepage_url = "homepage.html?id=" + imgdata["userId"];
    $("#author-name").attr("href", homepage_url);

    $(".img-big").attr("src", imgdata["images"]);
    $("#img-title").append(imgdata["imgtitle"]);
    $("#img-descript").append(imgdata["message"]);
    $(".img-head").attr("src", imgdata["pho"]);
    $("#author-name").append(imgdata["userName"]);
    $("#author-sign").append(imgdata["person"]);

    // 评论显现按钮
    $("#comment-btn-up").click(function () {
        $("#comment-btn-up").css("display", "none");
        $("#comment-btn-down").css("display", "block");
        $("#comment").css("display", "none");
        SetMainHeight();
    });
    //评论下拉
    $("#comment-btn-down").click(function () {
        $("#comment-btn-down").css("display", "none");
        $("#comment-btn-up").css("display", "block");
        var comment = $("#comment");
        comment.css("display", "block");
        comment.empty();
        var total;
        var lastpage;
        $.ajax({
            url: "https://www.aoteam.top/api/comment/get/" + imgid + "/1",
            type: "GET",
            headers: {
                Token: token
            },
            async: false,
            success: function (datas) {
                var data = datas["data"];
                var list = data["list"];
                total = data["total"];
                lastpage = data["lastPage"];
                for (var i = 0; i < list.length; i++) {
                    if (list[i]["parentId"] == 0) {
                        CreateFaComment(list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i].fromUSer, list[i].hour, list[i]["message"], list[i].commentGoodnum, comment, list[i].isgood);
                    } else {
                        CreateChildComment(list[i].parentId, list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i].fromUSer, list[i]["toName"], list[i].hour, list[i]["message"], list[i].commentGoodnum, comment, list[i].isgood);
                    }
                }
            }
        });
        if (lastpage != 0) {
            for (var page = 2; page <= lastpage; page++) {
                $.ajax({
                    url: "https://www.aoteam.top/api/comment/get/" + imgid + "/" + page,
                    type: "GET",
                    async: false,
                    success: function (datas) {
                        var data = datas["data"];
                        var list = data["list"];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i]["parentId"] == 0) {
                                CreateFaComment(list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i].fromUSer, list[i].hour, list[i]["message"], list[i].commentGoodnum, comment, list[i].isgood);
                            } else {
                                CreateChildComment(list[i].parentId, list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i].fromUSer, list[i]["toName"], 5, list[i]["message"], list[i].commentGoodnum, comment, isgood);
                            }
                        }
                    }
                });
            }
        }
        SetMainHeight();
        var con = $(".main-back .container");
        if (comment.get(0).scrollHeight > comment.get(0).clientHeight || comment.get(0).offsetHeight > comment.get(0).clientHeight) {
            $(".main-back").css("height", con.outerHeight() + parseInt(con.css("top")) + 100 + "px");
        }
        SetImgPosition();
    });
    //点赞功能
    $("#love-btn").click(function () {
        $.ajax({
            url: "https://www.aoteam.top/api/article/good.do/" + imgid,
            type: "PUT",
            headers: {
                Token: token
            },
            success: function (res) {
                alert_(res.msg);
                if (res.msg === "点赞成功!") {
                    $("#love-btn").empty();
                    $("#love-btn").append("<span class=\"iconfont love\" style=\"float: none;color: red\">&#xe61a; </span>取消喜欢");
                } else if (res.msg === "取消点赞成功!") {
                    $("#love-btn").empty();
                    $("#love-btn").append("<span class=\"iconfont love\" style=\"float: none;color: darkgrey\">&#xe61a; </span>喜欢");
                }
            }
        })
    });
//发布按钮功能
    $("#publish-comment").click(function () {
        var text = $("#comment-text").val();
        if (text === "" || text === null) {
            alert_("评论内容不能为空！");
        } else {
            PublishComment(imgid, text, 0, 0);
            $("#comment-text").val("");
        }
    });
// 关注按钮
    $("#attent-btn-t").click(function () {
        $.ajax({
            url: "https://www.aoteam.top/api/user/follow.do/" + imgdata.userId,
            type: "POST",
            headers: {
                Token: token
            },
            success: function (res) {
                alert_(res.msg);
            }
        });
        $("#attent-btn-t").css("display", "none");
        $("#attent-btn-f").css("display", "block");
    });
//取消关注按钮
    $("#attent-btn-f").click(function () {
        $.ajax({
            url: "https://www.aoteam.top/api/user/follow.do/" + imgdata.userId,
            type: "POST",
            headers: {
                Token: token
            },
            success: function (res) {
                alert_(res.msg);
            }
        });
        $("#attent-btn-f").css("display", "none");
        $("#attent-btn-t").css("display", "block");
    });
    SetMainHeight();
    setTimeout(function () {
        SetImgPosition();
    }, 600);
});


//根据url获取图片id
function GetIdFromUrl() {
    var name = "id";
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


// 创建父评论
function CreateFaComment(commentid, headurl, username, userid, commenttime, commentvalue, commentGoodnum, parent, isgood) {
    var fa = $("<div class='fa-comment'></div>");
    fa.attr("commentid", commentid);
    fa.attr("userid", userid)
    var head = $("<img class='img-head-min'/>");
    head.attr("src", headurl);
    var author = $("<div class='user-name'></div>");
    author.append(username);
    var time = $("<span class='comment-time'></span>");
    time.append(commenttime + "小时前");
    author.append(time);
    var comment = $("<div class='comment-value'></div>");
    comment.append(commentvalue);
    var button = $("<div style='height: 20px;'></div>");
    var reply = $("<a class=\"iconfont reply\" role='button' data-container='.main-back .container' data-toggle='popover' data-placement='bottom' data-html='true'>&#xe66a;</a>");
    reply.attr("data-content", "<textarea class=\"form-control\" id=\"c-comment-text\" placeholder=\"添加评论\"></textarea>\n" +
        "            <button class=\"btn btn-default\" id=\"comment-cancel\">取消</button>" +
        "            <button class='btn btn-default' id=\"c-publish-comment\">发布</button>");
    var love = $("<a class=\"iconfont love\">&#xe61a;</a>");
    if (isgood) {
        love.css("color", "darkred");
    }
    love.append("<span style=\"font-size: 10px\"'>" + commentGoodnum + "</span>");
    button.append(reply);
    button.append(love);
    fa.append(head);
    fa.append(author);
    fa.append(comment);
    fa.append(button);
    fa.appendTo(parent);
    parent.append("<hr>");
    love.click(function () {
        $.ajax({
            url: "https://www.aoteam.top/api/comment/good.do/" + commentid,
            type: "PUT",
            headers: {
                Token: token
            },
            success: function (res) {
                if (res.msg === "点赞成功!") {
                    commentGoodnum = commentGoodnum + 1;
                    love.empty();
                    love.append("&#xe61a;<span style=\"font-size: 10px\">" + commentGoodnum + "</span>")
                    love.css("color", "darkred");
                } else if (res.msg === "取消点赞成功!") {
                    commentGoodnum = commentGoodnum - 1;
                    love.empty();
                    love.append("&#xe61a;<span style=\"font-size: 10px\">" + commentGoodnum + "</span>")
                    love.css("color", "darkgrey");
                } else if (res.msg === "登录过期!" || res.msg === "您未登录!") {
                    window.location.href = "index.html";
                }
            }

        })
    })
    $("[data-toggle='popover']").popover();
    reply.click(function () {
        $("#c-publish-comment").click(function () {
            var text = $("#c-comment-text").val();
            if (text === "" || text === null) {
                alert_("评论不能为空!");
            } else {
                PublishComment(imgid, text, commentid, userid);
                $("[data-toggle='popover']").popover("hide");
                // $("[data-toggle='popover']").popover();
            }
        });
        $("#comment-cancel").click(function () {
            $("[data-toggle='popover']").popover("hide");
            // $("[data-toggle='popover']").popover();
        })
    });
}

// 创建子评论
function CreateChildComment(parentid, commentid, headurl, username, userid, toname, commenttime, commentvalue, commentGoodnum, parent, isgood) {
    var child = $("<div class='child-comment'></div>");
    child.attr("commentid", commentid);
    child.attr("userid", userid);
    var head = $("<img class='img-head-min'/>");
    head.attr("src", headurl);
    var author = $("<div class='user-name'></div>");
    author.append(username);
    author.append("<span style=\"color: black\">回复</span>");
    author.append(toname);
    var time = $("<span class='comment-time'></span>");
    time.append(commenttime + "小时前");
    author.append(time);
    var comment = $("<div class='comment-value'></div>");
    comment.append(commentvalue);
    var button = $("<div style='height: 20px;'></div>");
    var reply = $("<a class=\"iconfont reply\" role='button' data-container='.main-back .container' data-toggle='popover' data-placement='bottom' data-html='true'>&#xe66a;</a>");
    reply.attr("data-content", "<textarea class=\"form-control\" id=\"c-comment-text\" placeholder=\"添加评论\"></textarea>\n" +
        "            <button class=\"btn btn-default\" id=\"comment-cancel\">取消</button>" +
        "            <button class='btn btn-default' id=\"c-publish-comment\">发布</button>");
    var love = $("<a class=\"iconfont love\">&#xe61a;</a>");
    if (isgood) {
        love.css("color", "darkred");
    }
    love.append("<span style=\"font-size: 10px\">" + commentGoodnum + "</span>");
    button.append(reply);
    button.append(love);
    child.append(head);
    child.append(author);
    child.append(comment);
    child.append(button);
    child.appendTo(parent);
    parent.append("<hr>");
    love.click(function () {
        $.ajax({
            url: "https://www.aoteam.top/api/comment/good.do/" + commentid,
            type: "PUT",
            headers: {
                Token: token
            },
            success: function (res) {
                if (res.msg === "点赞成功!") {
                    commentGoodnum = commentGoodnum + 1;
                    love.css("color", "darkred");
                    love.empty();
                    love.append("&#xe61a;<span style=\"font-size: 10px\">" + commentGoodnum + "</span>")
                } else if (res.msg === "取消点赞成功!") {
                    commentGoodnum = commentGoodnum - 1;
                    love.css("color", "darkgrey");
                    love.empty();
                    love.append("&#xe61a;<span style=\"font-size: 10px\">" + commentGoodnum + "</span>")
                } else if (res.msg === "登录过期!" || res.msg === "您未登录!") {
                    window.location.href = "index.html";
                }
            }

        })
    });
    $("[data-toggle='popover']").popover();
    reply.click(function () {
        $("#c-publish-comment").click(function () {
            var text = $("#c-comment-text").val();
            if (text === "" || text === null) {
                alert_("评论不能为空!");
            } else {
                PublishComment(imgid, text, parentid, userid);
                $("[data-toggle='popover']").popover("hide");
                // $("[data-toggle='popover']").popover();
            }
        });
        $("#comment-cancel").click(function () {
            $("[data-toggle='popover']").popover("hide");
            // $("[data-toggle='popover']").popover();
        })
    });
}


//发布评论
function PublishComment(articleid, message, parentid, touser) {
    var data = {
        "articleId": articleid,
        "message": message,
        "parentId": parentid,
        "touser": touser
    };
    $.ajax({
        url: "https://www.aoteam.top/api/comment/insert.do",
        headers: {
            Token: token
        },
        type: "POST",
        data: data,
        success: function (res) {
            if (res.msg === "登录过期!" || res.msg === "您未登录") {
                window.location.href = "index.html";
            } else if (res.msg === "添加评论成功!") {
                alert_("发布成功");
                var comment = $("#comment");
                comment.empty();
                var total;
                var lastpage;
                $.ajax({
                    url: "https://www.aoteam.top/api/comment/get/" + imgid + "/1",
                    type: "GET",
                    headers: {
                        Token: token
                    },
                    async: false,
                    success: function (datas) {
                        var data = datas["data"];
                        var list = data["list"];
                        total = data["total"];
                        lastpage = data["lastPage"];
                        for (var i = 0; i < list.length; i++) {
                            if (list[i]["parentId"] == 0) {
                                CreateFaComment(list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i].fromUSer, 5, list[i]["message"], list[i].commentGoodnum, comment, list[i].isgood);
                            } else {
                                CreateChildComment(list[i].parentId, list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i].fromUSer, list[i]["toName"], 5, list[i]["message"], list[i].commentGoodnum, comment, list[i].isgood);
                            }
                        }
                    }
                });
                if (lastpage != 0) {
                    for (var page = 2; page <= lastpage; page++) {
                        $.ajax({
                            url: "https://www.aoteam.top/api/comment/get/" + imgid + "/" + page,
                            type: "GET",
                            async: false,
                            success: function (datas) {
                                var data = datas["data"];
                                var list = data["list"];
                                for (var i = 0; i < list.length; i++) {
                                    if (list[i]["parentId"] == 0) {
                                        CreateFaComment(list[i]["commentId"], imgdata["pho"], list[i]["fromName"], 5, list[i]["message"], comment, list[i].isgood);
                                    } else {
                                        CreateChildComment(list[i]["commentId"], imgdata["pho"], list[i]["fromName"], list[i]["toName"], 5, list[i]["message"], comment, isgood);
                                    }
                                }
                            }
                        });
                    }
                }
                SetMainHeight();
                SetImgPosition();
            }
        }
    })
}

//设置背景高度
function SetMainHeight() {
    var win_width = $(document).width();
    var win_height = $(document).height();
    var html_height = window.outerHeight;
    var back = $(".main-back");
    back.css("height", window.outerHeight);
    var img = $(".img-big");
    var img_height = (img.width() / 280) * parseInt(img.attr("src").split("?")[1]);
    var con = $(".main-back .container");
    con.css("left", (win_width - con.width()) / 2 + "px");
    con.css("top", "100px");
}

//设置图片位置
function SetImgPosition() {
    var img = $(".img-big");
    var con_height = $(".main-back .container").height();
    var img_height = (img.width() / 280) * parseInt(img.attr("src").split("?")[1]);
    if (img_height <= con_height) {
        img.css("margin-top", 50 + "px");   //调整图片位置
        img.css("margin-bottom", 50 + "px");   //调整图片位置
    } else {
        img.css("margin-top", (con_height - img_height) / 2 + "px");   //调整图片位置
        img.css("margin-bottom", (con_height - img_height) / 2 + "px");   //调整图片位置
    }
}

$(function () {
    $("[data-toggle='popover']").popover();
});
