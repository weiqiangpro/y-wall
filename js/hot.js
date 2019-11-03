
var isempty = false;
var pagenum = 1;                 //请求后端页数
$(document).ready(function () {
    var firstdata = FirstGetImg();
    AddImg(firstdata,token);
    SetCenter(".main",".box");
    var boxchild = $(".main").find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    ImgPosition(".main",".box",cols);
    pagenum = pagenum + 2;
    var cato = GetCatoFromUrl();
    if(cato === "comment"){
        UpdataByComment();
    }else if(cato === "hot"){
        UpdataByHot();
    }
});

//根据url获取热门种类
function GetCatoFromUrl() {
    var name = "cato";
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//滑动条滑动监听事件
$(document).scroll(function () {
    // CheckIsLoad();
    var boxchild = $(".main").find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    if(CheckIsLoad()){
        if(isempty == true){
            var height = $(document).height();
            var width = $(document).width();
            var empty = $("<div class='h5' style='position: absolute; width: 200px;color: grey;font-family: 微软雅黑;'>照片库存已见底了</div>");
            empty.css("top",height+30+"px");
            empty.css("margin-left",width/2-100+"px");
            empty.css("margin-bottom",30+"px");
            var body = $("body");
            var line = $("<hr style='position: absolute'>");
            line.css("width",width+"px");
            line.css("top",height+"px");
            line.appendTo(body);
            empty.appendTo(body);
            $(document).unbind('scroll');
        }else{
            $.ajax({
                url:"https://www.aoteam.top/api/article/topgood/"+pagenum,
                type:"GET",
                headers:{
                    Token:token
                },
                dataType:"json",
                async:false,
                success:function (datas) {
                    var imgmsg = datas.data.list;
                    AddImg(imgmsg,token);
                    ImgPosition(".main",".box",cols);
                    pagenum = pagenum + 1;
                    if(pagenum > GetPageSize(datas)){
                        isempty = true;
                    }
                }
            });
        }
    }
});
//窗口尺寸变化监听事件
$(window).resize(function () {
    SetCenter(".main",".box");
    var boxchild = $(".main").find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    ImgPosition(".main",".box",cols);
});

// 第一次获取图片，返回具体图片信息
function FirstGetImg() {
    var data;
    if(!islogin){
        // token = null;
    }
    $.ajax({
        url:"https://www.aoteam.top/api/article/topgood/1",
        type:"GET",
        headers:{
            Token:token
        },
        async:false,
        success: function(datas) {
            data = datas.data.list;
        }
    });
    $.ajax({
        url:"https://www.aoteam.top/api/article/topgood/2",
        type:"GET",
        headers:{
            Token:token
        },
        async:false,
        success: function(datas) {
            data = data.concat(datas.data.list);
        }
    });
    return data;
}
//第一次获取评论top图片
function FirstGetImg_Comment() {
    var data;
    if(!islogin){
        // token = null;
    }
    $.ajax({
        url:"https://www.aoteam.top/api/article/topcomment/1",
        type:"GET",
        headers:{
            Token:token
        },
        async:false,
        success: function(datas) {
            data = datas.data.list;
        }
    });
    $.ajax({
        url:"https://www.aoteam.top/api/article/topcomment/2",
        type:"GET",
        headers:{
            Token:token
        },
        async:false,
        success: function(datas) {
            data = data.concat(datas.data.list);
        }
    });
    return data;
}
//第一次获取综合top图片
function FirstGetImg_Hot() {
    var data;
    if(!islogin){
        // token = null;
    }
    $.ajax({
        url:"https://www.aoteam.top/api/article/topall/1",
        type:"GET",
        headers:{
            Token:token
        },
        async:false,
        success: function(datas) {
            data = datas.data.list;
        }
    });
    $.ajax({
        url:"https://www.aoteam.top/api/article/topall/2",
        type:"GET",
        headers:{
            Token:token
        },
        async:false,
        success: function(datas) {
            data = data.concat(datas.data.list);
        }
    });
    return data;
}

//根据具体的图片信息,向页面中添加盒子
function AddImg(data) {
    var main = $(".main");
    for(var i = 0;i<data.length;i++){
        var arr = data[i]["articleImages"].split("?");
        var url = arr[0];
        var imgid = data[i]["articleId"];
        var imgheight = arr[1];
        var parentdiv = $("<div class='box'><div/>");

        var img = $("<img class='img-responsive img-rounded'>");
        img.attr("src",url);
        img.attr("imgid",imgid);
        img.css("height",imgheight+"px");
        img.appendTo(parentdiv);

        var head = $("<img class='min-head'>");
        head.attr("src",data[i].pho);

        var authorname = $("<a class='author-name'></a>");
        authorname.append(data[i].name);
        authorname.attr("href","homepage.html?id="+data[i].userid);

        var love = $("<div>\n" +
            "            <div class=\"love-num\"></div><span class=\"iconfont love-icon\">&#xe61a;</span>\n" +
            "        </div>");
        $(love).find("div").append(data[i].goodNum);
        if(data[i].isgood){
            $(love).find("span").css("color","red");
        }

        parentdiv.append(img);
        parentdiv.append(head);
        parentdiv.append(authorname);
        parentdiv.append(love);
        parentdiv.appendTo(main);
        img.click(function () {
            var d = window.open("img-details.html?id="+$(this).attr("imgid"));
        });
        $(love).find("span").click(function () {
            var b = $(this);
            $.ajax({
                url:"https://www.aoteam.top/api/article/good.do/"+$(this).attr("imgid"),
                type:"PUT",
                headers:{
                    Token:token
                },
                success:function (res) {
                    if(res.msg === "登录过期!"){
                        window.location.href="index.html";
                    }else if(res.msg === "点赞成功!"){
                        alert_("点赞成功！");
                        b.css("color","red");
                    }else{
                        alert_("取消点赞");
                        b.css("color","gray");
                    }

                }
            });
        })
    }
}
//添加评论top图片信息
function AddImg_Comment(data) {
    var main = $(".main");
    for(var i = 0;i<data.length;i++){
        var arr = data[i]["articleImages"].split("?");
        var url = arr[0];
        var imgid = data[i]["articleId"];
        var imgheight = arr[1];
        var parentdiv = $("<div class='box'><div/>");

        var img = $("<img class='img-responsive img-rounded'>");
        img.attr("src",url);
        img.attr("imgid",imgid);
        img.css("height",imgheight+"px");
        img.appendTo(parentdiv);

        var head = $("<img class='min-head'>");
        head.attr("src",data[i].pho);

        var authorname = $("<a class='author-name'></a>");
        authorname.append(data[i].name);
        authorname.attr("href","homepage.html?id="+data[i].userid);

        var comment = $("<div>\n" +
            "            <div class=\"comment-num\"></div><span class=\"iconfont comment-icon\">&#xe66a;</span>\n" +
            "        </div>");
        $(comment).find("div").append(data[i].commentNum);

        parentdiv.append(img);
        parentdiv.append(head);
        parentdiv.append(authorname);
        parentdiv.append(comment);
        parentdiv.appendTo(main);
        img.click(function () {
            var d = window.open("img-details.html?id="+$(this).attr("imgid"));
        });
    }
}
//添加综合top图片信息
function AddImg_Hot(data) {
    var main = $(".main");
    for(var i = 0;i<data.length;i++){
        var arr = data[i]["articleImages"].split("?");
        var url = arr[0];
        var imgid = data[i]["articleId"];
        var imgheight = arr[1];
        var parentdiv = $("<div class='box'><div/>");

        var img = $("<img class='img-responsive img-rounded'>");
        img.attr("src",url);
        img.attr("imgid",imgid);
        img.css("height",imgheight+"px");
        img.appendTo(parentdiv);

        var head = $("<img class='min-head'>");
        head.attr("src",data[i].pho);

        var authorname = $("<a class='author-name'></a>");
        authorname.append(data[i].name);
        authorname.attr("href","homepage.html?id="+data[i].userid);

        var hot = $("<div>\n" +
            "            <div class=\"comment-num\"></div><span class=\"iconfont_ comment-icon\">&#xe619;</span>\n" +
            "        </div>");
        $(hot).find("div").append((data[i].commentNum*0.3+data[i].goodNum*0.7).toFixed(2));

        parentdiv.append(img);
        parentdiv.append(head);
        parentdiv.append(authorname);
        parentdiv.append(hot);
        parentdiv.appendTo(main);
        img.click(function () {
            var d = window.open("img-details.html?id="+$(this).attr("imgid"));
        });
    }
}

// 图片墙居中
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
            box.css("top",minheight +72+"px");
            heightArr[minindex] = minheight+box_height;
        }
    }
}

// 检查是否开始加载新图片
function CheckIsLoad() {
    var last_box = $('.main').find(".box:last-child");
    // 最后一个盒子的一半到html顶端的高度
    var last_box_top = last_box.outerHeight()*0.5+parseFloat(last_box.css("top"));
    var window_top_scro = $(document).scrollTop();
    var window_height = $(window).height();
    return last_box_top <= window_height+window_top_scro;
}

// 获取后台数据总页数
function GetPageSize(datas) {
    var data = datas["data"];
    var size = data["pages"];
    return size
}

//按照评论最多来更新图片墙
function UpdataByComment() {
    var main = $(".main");
    main.empty();
    pagenum = 1;
    var firstdata = FirstGetImg_Comment();
    AddImg_Comment(firstdata,token);
    SetCenter(".main",".box");
    var boxchild = $(".main").find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    ImgPosition(".main",".box",cols);
    pagenum = pagenum + 2;
    $(document).unbind('scroll');
    $(document).scroll(function () {
        var boxchild = $(".main").find(".box:first-child");
        var boxwidth = boxchild.outerWidth(true);
        var screenwidth = $(window).width();
        var cols = parseInt(screenwidth/boxwidth);
        if(CheckIsLoad()){
            if(isempty == true){
                var height = $(document).height();
                var width = $(document).width();
                var empty = $("<div class='h5' style='position: absolute; width: 200px;color: grey;font-family: 微软雅黑;'>照片库存已见底了</div>");
                empty.css("top",height+30+"px");
                empty.css("margin-left",width/2-100+"px");
                empty.css("margin-bottom",30+"px");
                var body = $("body");
                var line = $("<hr style='position: absolute'>");
                line.css("width",width+"px");
                line.css("top",height+"px");
                line.appendTo(body);
                empty.appendTo(body);
                $(document).unbind('scroll');
            }else{
                $.ajax({
                    url:"https://www.aoteam.top/api/article/topcomment/"+pagenum,
                    type:"GET",
                    headers:{
                        Token:token
                    },
                    dataType:"json",
                    async:false,
                    success:function (datas) {
                        var imgmsg = datas.data.list;
                        AddImg_Comment(imgmsg,token);
                        ImgPosition(".main",".box",cols);
                        pagenum = pagenum + 1;
                        if(pagenum > GetPageSize(datas)){
                            isempty = true;
                        }
                    }
                });
            }
        }
    })
}
//按照点赞最多来更新图片墙
function UpdataByLove() {
    var main = $(".main");
    main.empty();
    pagenum = 1;
    var firstdata = FirstGetImg();
    AddImg(firstdata,token);
    SetCenter(".main",".box");
    var boxchild = $(".main").find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    ImgPosition(".main",".box",cols);
    pagenum = pagenum + 2;
    $(document).unbind('scroll');
    $(document).scroll(function () {
        var boxchild = $(".main").find(".box:first-child");
        var boxwidth = boxchild.outerWidth(true);
        var screenwidth = $(window).width();
        var cols = parseInt(screenwidth/boxwidth);
        if(CheckIsLoad()){
            if(isempty == true){
                var height = $(document).height();
                var width = $(document).width();
                var empty = $("<div class='h5' style='position: absolute; width: 200px;color: grey;font-family: 微软雅黑;'>照片库存已见底了</div>");
                empty.css("top",height+30+"px");
                empty.css("margin-left",width/2-100+"px");
                empty.css("margin-bottom",30+"px");
                var body = $("body");
                var line = $("<hr style='position: absolute'>");
                line.css("width",width+"px");
                line.css("top",height+"px");
                line.appendTo(body);
                empty.appendTo(body);
                $(document).unbind('scroll');
            }else{
                $.ajax({
                    url:"https://www.aoteam.top/api/article/topgood/"+pagenum,
                    type:"GET",
                    headers:{
                        Token:token
                    },
                    dataType:"json",
                    async:false,
                    success:function (datas) {
                        var imgmsg = datas.data.list;
                        AddImg(imgmsg,token);
                        ImgPosition(".main",".box",cols);
                        pagenum = pagenum + 1;
                        if(pagenum > GetPageSize(datas)){
                            isempty = true;
                        }
                    }
                });
            }
        }
    })
}
//按照热度最多来更新图片墙
function UpdataByHot() {
    var main = $(".main");
    main.empty();
    pagenum = 1;
    var firstdata = FirstGetImg_Hot();
    AddImg_Hot(firstdata,token);
    SetCenter(".main",".box");
    var boxchild = $(".main").find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
    var screenwidth = $(window).width();
    var cols = parseInt(screenwidth/boxwidth);
    ImgPosition(".main",".box",cols);
    pagenum = pagenum + 2;
    $(document).unbind('scroll');
    $(document).scroll(function () {
        var boxchild = $(".main").find(".box:first-child");
        var boxwidth = boxchild.outerWidth(true);
        var screenwidth = $(window).width();
        var cols = parseInt(screenwidth/boxwidth);
        if(CheckIsLoad()){
            if(isempty == true){
                var height = $(document).height();
                var width = $(document).width();
                var empty = $("<div class='h5' style='position: absolute; width: 200px;color: grey;font-family: 微软雅黑;'>照片库存已见底了</div>");
                empty.css("top",height+30+"px");
                empty.css("margin-left",width/2-100+"px");
                empty.css("margin-bottom",30+"px");
                var body = $("body");
                var line = $("<hr style='position: absolute'>");
                line.css("width",width+"px");
                line.css("top",height+"px");
                line.appendTo(body);
                empty.appendTo(body);
                $(document).unbind('scroll');
            }else{
                $.ajax({
                    url:"https://www.aoteam.top/api/article/topall/"+pagenum,
                    type:"GET",
                    headers:{
                        Token:token
                    },
                    dataType:"json",
                    async:false,
                    success:function (datas) {
                        var imgmsg = datas.data.list;
                        AddImg_Hot(imgmsg,token);
                        ImgPosition(".main",".box",cols);
                        pagenum = pagenum + 1;
                        if(pagenum > GetPageSize(datas)){
                            isempty = true;
                        }
                    }
                });
            }
        }
    })
}