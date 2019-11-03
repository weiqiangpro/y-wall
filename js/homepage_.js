
var me_msg;
var isempty = false;   //判断后台是否还有数据
var page = 1;       //请求作品页数
var cols;           //作品墙中作品的列数
var author_id;


$(document).ready(function () {
    me_msg = userdata;
    author_id = me_msg.userId;
    SetMeMsg(me_msg);
    var data = GetWorks(page);
    page = page+1;
    if(data.pageNum === data.lastPage){
        isempty = true;
    }
    AddImgs(data);
    //照片墙居中
    cols = SetCenter("#img-wall",".main");
    ImgPosition(".main",".box",cols);
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

//添加作品按钮
$("#add").click(function () {
    window.location.href="publishworks.html";
});
//编辑资料按钮
$("#redact").click(function () {
    window.location.href="edit.html";
});
//获取作品
function GetWorks(page) {
    var data;
    $.ajax({
        url:"https://www.aoteam.top/api/article/myarticle.do/"+page,
        async:false,
        headers:{
            Token:token,
        },
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
        img.css("height",arr[1]+"px");
        box.css("height",parseInt(arr[1])+20+"px");
        img.appendTo(box);
        box.appendTo($(".main"));
        box.attr("articleid",list[i].articleId);
        box.click(function () {
           window.open("img-details.html?id="+$(this).attr("articleid"));
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
//设置作者信息
function SetMeMsg(data){
    $("#author-head img").attr("src",data.pho);
    $("#author-name").append(data.userName);
    $("#author-num").append(" "+data.followednums+"粉丝·"+data.follownums+"关注");
    $("#author-sign").append(data.person);
    if(data.sex === 0){
        $("#gender").prepend("男");
    }else{
        $("#gender").prepend("女");
    }
    $("#hometown").append(data.home);
}

// child 在parent中居中
function SetCenter(parent,child) {
    var boxchild = $(child).find(".box:first-child");
    var boxwidth = boxchild.outerWidth(true);
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
    var initheight = $(parent).find(child+":first-child").offset().top;
    var initleft = $(parent).find(child+":first-child").offset().left;
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

