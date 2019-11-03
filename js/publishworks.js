$(document).ready(function () {
    if(token === "" || token === null){
         window.location.href="index.html"
    }

    var me_msg = GetMeMsg(token);
	console.log(me_msg);
    $("#work-head").attr("src",me_msg.pho);
    $("#author-name").append(me_msg.userName);
    var win_height = window.outerHeight;
    var win_width = window.outerWidth;
    $(".main-back").css("height",window.outerHeight+"px");

    var container = $(".main-back .container");
    container.css("left",(win_width-container.outerWidth())/2+"px");
    container.css("top",(win_height-72-container.outerHeight())/2+72+"px");

    var img = $("div.img");
    img.css("margin-top",(container.height()-img.height())/2+"px");

    var file = $(".input-file");
    file.css("height",img.outerHeight()+"px");
    file.css("width",img.outerWidth()+"px");
    file.css("top",(container.height()-img.height())/2+"px");

    img.ondragover=function(e){
        e.preventDefault();
    };
    //图片上传效果
    file.change(function () {
        var file_ = this.files[0];
        var reader = new FileReader();
        img.empty();
        img.css('text-align','center');
        var imgfile = $("<img id='img' />");
        imgfile.css("max-height",img.height());
        imgfile.css("max-width",img.width());
        reader.addEventListener("load", function () {
            imgfile.attr("src",reader.result);
        }, false);
        if (file_) {
            reader.readAsDataURL(file_);
        }
        imgfile.css("max-width",img.width());
        img.append(imgfile);
        file.css("display","none");
    });
    //发布按钮
    $("#publish_btn").click(function () {
        // var file = $(".input-file").files[0];
        var worksname = $("#title").val();
        var description = $("#description").val();
        var img = $('#img');
        var imgheight = parseInt(img.height()*280/img.width());
        var file = $("#img").attr("src");
        if(file === "" || file === null  ){
            alert_("未上传图片");
        }else{
            var formData = new FormData();
            formData.append('file', document.getElementsByClassName("input-file")[0].files[0]);
            formData.append("title",worksname);
            formData.append("height",imgheight);
            formData.append("message",description);
            $.ajax({
                url: "https://www.aoteam.top/api/article/insert.do",
                method: 'POST',
                headers:{
                    Token:token
                },
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (res) {
                    if(res.status === 0){
                        alert_("发布成功");
                    }else{
                        alert_("发布失败");
                    }
                }
            });
        }
    })

});
