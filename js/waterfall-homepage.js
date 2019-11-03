$(document).ready(function () {
   var clos = SetCenter("#img-wall",".main");
   ImgPosition(".main",".box",clos);

   $(".modal-content h4").append($("#author-name").text());

   $("#pri-letter").click(function () {
      $("#pri-letter_modal").modal("show");
   });

});




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
        console.log("j:",j);
        box = $(allbox[i]);
        box_height = box.outerHeight();
        console.log("box_height",box_height);
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