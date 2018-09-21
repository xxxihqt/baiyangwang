jQuery($=>{

     $('.logo').click(function() {
        location.href="http://localhost:18051/index.html";
    });

    $('.code').css('background', randomColor(16));
    $('.code').html(randomCode(4));

    $('.code').click(function() {
        $('.code').css('background', randomColor(16));
        $('.code').html(randomCode(4));
    });
    $('.newVip').click(function() {
        location.href="http://localhost:18051/html/register.html";
    });

    $('#logBtn').click(function() {

        // 检验验证码是否正确
        var codeNum=$('#check_code input').val();
        var realCode=$('.code').html();
        if(codeNum==realCode){
            console.log(codeNum);
            // 获取用户名、密码
            var username=$('#username').val();
            var password=$('#password').val();
            var check=$('.checkbox')[0].checked;
            $.ajax({
                url: '../api/userData.php',
                type: 'post',
                async: true,
                data: {
                        'login':'login',
                        'username': username,
                        'password': password,
                        'check':check
                },
            })
            .success(function(str) {
                if(str!=false){
                    console.log(str);
                    location.href="http://localhost:18051/index.html?name="+str;
                }
            })
        }
        else{
            alert('验证码不正确');
            $('.code').css('background', randomColor(16));
            $('.code').html(randomCode(4));

        }
        
    });

})