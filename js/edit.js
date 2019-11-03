$(document).ready(function () {
    if(token === "" || token === null){
        window.location.href="index.html"
    }
    InitMsg();
});

//完成修改
$("#complete").click(function () {
    var file = document.getElementById("head-file").files[0];
    var nickname = $("#nickname").val();
    var gender = GetGender();
    $("#birth").val("2019-10-25");
    var birth = $("#birth").val();
    var home = $("#home").val();
    var person = $("#author-sign").val();

    var formData = new FormData();
    formData.append("file",file);
    formData.append("birthday",birth);
    formData.append("home",home);
    formData.append("person",person);
    formData.append("sex",gender);
    formData.append("username",nickname);

    $.ajax({
        url:"https://www.aoteam.top/api/user/information.do",
        headers:{
            Token:token
        },
        type:"POST",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success:function (res) {
        }
    });

});

//取消按钮恢复初始
$("#edit_cancel").click(function () {
    InitMsg();
});

//初始化个人信息
function InitMsg() {
    $("#head-big").attr("src",userdata.pho);
    $("#nickname").val(userdata.userName);
    $("#home").val(userdata.home);
    if(userdata.birthday === null){
        var mydate = new Date();
        var date = mydate.toLocaleDateString().replace(/\//g, "-");
        $("#birth").val(date);
    }else{
        $("#birth").val(userdata.birthday);
    }
    if(userdata.sex === 0){
        $("#nan").attr("checked",true);
    }else{
        $("#nv").attr("checked",true);
    }
    $("#author-sign").val(userdata.person);
}

//头像变换
$("#head-file").change(function () {
    var file_ = this.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        $("#head-big").attr("src",reader.result);
    }, false);
    if (file_) {
        reader.readAsDataURL(file_);
    }
});

function GetGender() {
    var gender = 0;
    if($("#nan:checked").val() === "on"){
        gender = 0;
    }
    if($("#nv:checked").val() === "on"){
        gender = 1;
    }
    return gender;
}

$("#change_pass").click(function () {
    $("#change_pass_modal").modal("show");
});
$("#cancel_change").click(function () {
    if(!islogin){
        window.location.href="index.html";
        return;
    }
    $("#change_pass_modal").modal("hide");
});
$("#confirm_change").click(function () {
    var new1 = $("#new_pass1").val();
    var new2 = $("#new_pass2").val();
    var old = $("#old_pass").val();
    if(new1 === new2){
        $.ajax({
            url:"https://www.aoteam.top/api/user/modifypd.do",
            type:"PUT",
            headers:{
                Token:token
            },
            data:{
                newPasswd1:new1,
                newPasswd2:new2,
                oldPasswd:old
            },
            success:function (res) {
                if(res.status === 0){
                    swal("修改成功!");
                    window.location.href="index.html";
                }else{
                    $("#mes").empty();
                    $("#mes").append(res.msg);
                }
            }
        })
    }
});