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
    $('.toLogin').click(function() {
        location.href="http://localhost:18051/html/login.html";
    });

    $('#username').val(NW_code(6));
    $('#password').val(randomCode(6));

    // 用户名输入
        $('#username').click(function() {
            $('#username').val('');
        });

    // 用户名验证
        $('#username').keyup(function() {
            if($('#username').val()===null){
                $('#username').val(NW_code(6));
            }
            let username=$('#username').val();
            $.ajax({
                    type: 'get',
                    url: '../api/userData.php',
                    async: true,
                    data: {
                           'username':username
                    },
                    success:function(str){
                        if(str=='ok'){

                        }else{

                        }
                    }
            });
        });

    // 密码输入
        $('#password').click(function() {
            $('#password').val('');
        });
    // 密码验证
        $('#password').keyup(function() {
            if($('#password').val()===null){
                $('#password').val(randomCode(6));
            }
            $password=$('#password').attr('type','password');
            let password=$('#password').val();
            $.ajax({
                    type: 'post',
                    url: '../api/userData.php',
                    async: true,
                    data: {
                           'password':password
                    },
                    success:function(str){
                        if(str=='ok'){

                        }else{

                        }
                    }
            });
        });


    // 邮箱验证
        $('#email').keyup(function() {
            let email=$('#email').val();
            $.ajax({
                    type: 'get',
                    url: '../api/userData.php',
                    async: true,
                    data: {
                           'email':email
                    },
                    success:function(str){
                        if(str=='ok'){

                        }else{

                        }
                    }
            });
        });


    // 提交注册
        $('#regBtn').click(function() {
             // 获取用户名和密码
            var username=$('#username').val();
            console.log(username);
            var password=$('#password').val();
            var email=$('#email').val();
            console.log(email);
            if($('#checkbox')[0].checked){
                $.ajax({
                    url: '../api/userData.php',
                    type: 'post',
                    async: true,
                    data: {
                           'reg':'reg',
                           'username':username,
                           'password':password,
                           'email':email
                    },
                    success:function(str){
                        if(str!=false){
                            console.log(666);
                            location.href="http://localhost:18051/index.html?name="+str;
                        }else{

                        } 
                    }
                })
            }else{
                alert('还没同意《服务协议》');
            }
        });

})