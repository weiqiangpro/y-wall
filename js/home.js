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
            box.css("top",minheight+72+"px");
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

// 在parent中添加新的图片元素
function InsertNewImg(parent,cols) {
    var data = ["img/2.jpg","img/1.jpg","img/3.jpg",
        "img/4.png","img/5.jpg","img/6.jpg","img/7.gif",
        "img/8.jpg","img/9.png","img/3.jpg","img/11.png",
        "img/12.jpg","img/13.jpg","img/14.jpg"];
    for(var i = 0;i<data.length;i++){
        var parentdiv = $("<div><div/>");
        parentdiv.addClass("box");

        var img = $("<img>");
        img.addClass("img-responsive");
        img.addClass("img-rounded");
        img.attr("src",data[i]);
        img.appendTo(parentdiv);

        var author = $("<div><div/>");
        author.addClass("author");

        var head_img = $("<img>");
        head_img.addClass("head-photo-min");
        head_img.attr("src","img/1.jpg");
        head_img.appendTo(author);

        var username = $("<div></div>");
        username.addClass("username");
        username.append("魏强");
        username.appendTo(author);

        var button = $("<a></a>");
        button.addClass("btn iconfont");
        button.append("&#xe6d4;");
        button.css("font-size","18px");
        author.appendTo(parentdiv);
        button.appendTo(parentdiv);
        parentdiv.appendTo($(parent));
    }
    ImgPosition(".main",".box",cols);
}


$(document).ready(function () {
    var cols = SetCenter(".main", ".box");
    setTimeout(function(){
        ImgPosition(".main",".box",cols);
    },100);
    ImgPosition(".main",".box",cols);

    $(document).scroll(function () {
        CheckIsLoad();
        if(CheckIsLoad()){
            InsertNewImg(".main",cols);
        }
    })
});
