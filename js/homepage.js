var isempty = false;   //判断后台是否还有数据
var author_id;         //页面作者id
var author_msg;       //作者信息

var page = 1;       //请求作品页数
var cols;           //作品墙中作品的列数

$(document).ready(function () {
    author_id = GetIdFromUrl();

    author_msg = GetOthersMsg(author_id);

    //设置作者信息
    SetAuthorMsg(author_msg);
    $(".modal-content h4").append($("#author-name").text());
    var data = GetWorks(author_id,page);
    page = page+1;
    if(data.pageNum === data.lastPage){
        isempty = true;
    }
    AddImgs(data);
    //照片墙居中
    cols = SetCenter("#img-wall",".main");
    ImgPosition(".main",".box",cols);
//关注按钮
    $("#attent").click(function () {
        Follow(author_id);
    });
//发送按钮
    $("#send_").click(function () {
        console.log(author_id);
        SendMsg(token,author_id);
    });
//私信按钮
    $("#pri-letter").click(function () {
        $("#pri-letter_modal").modal("show");
    });
});

//浏览器窗口尺寸适配
$(window).resize(function () {
    cols = SetCenter("#img-wall",".main");
    ImgPosition(".main",".box",cols);
});

//页面滑动监听器
$(document).scroll(function () {
    if(CheckIsLoad()){
        if(isempty){
        }else{
            var data = GetWorks(author_id,page);
            page = page+1;
            if(data.pageNum === data.lastPage){
                isempty = true;
            }
            AddImgs(data);
            ImgPosition(".main",".box",cols);
        }
    }
});



//获取作品
function GetWorks(userid,page) {
    var data;
    $.ajax({
        url:"https://www.aoteam.top/api/article/getbyuser/"+userid+"/"+page,
        async:false,
        success:function (res) {
            data = res.data;
        }
    });
    return data;
}
//向墙中添加作品
function AddImgs(data) {
    var list = data.list;
    for(var i = 0;i<list.length;i++){
        var arr = list[i]["articleImages"].split("?");
        var box = $("<div class=\"box\"></div>");
        var img = $("<img class=\"img-responsive img-rounded\"/>");
        img.attr("src",list[i].articleImages);
        box.attr("articleid",list[i].articleId);
        img.css("height",arr[1]+"px");
        box.css("height",parseInt(arr[1])+20+"px");
        img.appendTo(box);
        box.appendTo($(".main"));

        box.click(function () {
           window.open("img-details.html?id="+$(this).attr("articleId"));
        });
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

// child 在parent中居中
function SetCenter(parent,child) {
    var boxchild = $(child).find(".box:first-child");
    var boxwidth = boxchild.outerWidth();
    var parentwidth = $(parent).width();
    var cols = parseInt(parentwidth/boxwidth);
    var main = $(child);
    main.width(boxwidth*cols);
    main.css("margin", (parentwidth-main.width())/4+"px"+" auto");
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
    // var mainmargin = parseFloat($(parent).css("margin-left"));
    var initheight = $(parent).find(child+":first-child").offsetTop;
    var initleft = $(parent).find(child+":first-child").offsetLeft;
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
            box.css("left",minindex*box.outerWidth()+initleft+"px");
            box.css("top",minheight+initheight+"px");
            heightArr[minindex] = minheight+box_height;
            if(i == allbox.length-1){
                $("#img-wall").height(heightArr[minindex]+initheight-$("#img-wall").offset().top+parseInt($(".main").css("margin-top")));
            }
        }
    }
}


//获取Token
function GetToken() {
    var cookie = document.cookie;
    var token;
    if(cookie.indexOf("token=") !== -1){
        token = cookie.replace("token=","");
    }else{
        token = "";
    }
    return token;
}

//获取自己信息
function GetMeMsg(token) {
    var data;
    $.ajax({
        url:"https://www.aoteam.top/api/user/me.do",
        headers:{
            Token:token
        },
        async:false,
        success:function (res) {
            data = res.data;
        }
    });
    return data;
}


//根据url获取作者id
function GetIdFromUrl() {
    var name = "id";
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//获取作者信息
function GetOthersMsg(id) {
    var data;
    $.ajax({
        url:"https://www.aoteam.top/api/user/other/"+id,
        type:"GET",
        async:false,
        success:function (res) {
            data = res.data;
        }
    });
    return data
}

//初始化作者信息
function SetAuthorMsg(msg) {
    $("#author-head img").attr("src",msg.pho);
    $("#author-name").prepend(msg.userName);
    $("#author-num").append(" "+msg.followednums+"粉丝·"+msg.follownums+"关注");
    $("#author-sign").append(msg.person);
    if(msg.sex === 0){
        $("#gender").prepend("男");
    }else{
        $("#gender").prepend("女");
    }
    $("#hometown").append(msg.home);

}

//关注按钮功能
function Follow(id) {
    var token = GetToken();
    if(!islogin){
        alert_("您未登录");
    }else{
        $.ajax({
            url:"https://www.aoteam.top/api/user/follow.do/"+id,
            type:"POST",
            headers:{
                Token:token
            },
            success:function (res) {
            }
        })
    }
}

//发送私信
function SendMsg(token,userid) {
    var msg = $("#letter-text").val();
    if(msg === "" || msg === null){
        alert_("发送内容不能为空！");
        return
    }
    var data = {
        "userid":userid,
        "message":msg
    };
    $.ajax({
        url:"https://www.aoteam.top/api/mes/send.do",
        headers:{
            Token:token
        },
        data:data,
        type:"POST",
        success:function (res) {
            if(res.data === null) {
                alert_("您未登录！");
            }else{
                alert_(res.msg);
            }
        }
    })
}