<?php

    // 连接数据库，输入主机、用户名和密码、数据库名称
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = 'baiyangwang';

    // （1）创建链接
    $conn= new mysqli($servername ,$username ,$password,$dbname);

    // (2)检测链接
    if($conn->connect_error){
        die("连接失败：".$conn->connect_error);
    }

    $conn->set_charset('utf8');


    // 获取前端返回的参数
    $username=isset($_GET['username'])?$_GET['username']:null;
    $password=isset($_POST['password'])?$_POST['password']:null;
    $email=isset($_GET['email'])?$_GET['email']:null;
    $reg=isset($_POST['reg'])?$_POST['reg']:null;
    $login=isset($_POST['login'])?$_POST['login']:null;



    if($username){
        if(preg_match("/^[\w\_]{6,20}$/u",$username)) {
            $sql_name="select * from userData where username='$username'";
            $result_name = $conn->query($sql_name);
            if($result_name->num_rows>0){
                echo "fail";
            }
        }else{
                echo "fail";
        }
    }

    if($password){
        if(preg_match("/^[\w]{6,12}$/u",$password)) {
        }else{
            echo "fail";
        }
    }

    if($email){
        if(preg_match("/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i",$email)) {
        }else{
            echo "fail";
        }
    }

    if($reg){
        $username=isset($_POST['username'])?$_POST['username']:null;
        $password=isset($_POST['password'])?$_POST['password']:null;
        $password=md5($password);
        $email=isset($_POST['email'])?$_POST['email']:null;

        // 写入数据库
        $sql = "insert into userData (username, password, email) values ('$username','$password','$email')";
        $result= $conn->query($sql); 
        if($result){
            echo $username;
        }else{
            echo false;
        }
    }

    if($login){
        $username=isset($_POST['username'])?$_POST['username']:null;
        $password=isset($_POST['password'])?$_POST['password']:null;
        $check=isset($_POST['check'])?$_POST['check']:null;
        $password=md5($password);

        $sql="select * from userData where username='$username' and password='$password'";

        // 执行查询语句
        $result =$conn->query($sql);

        // var_dump($result);
        if($result->num_rows>0){
            $row = $result->fetch_all(MYSQLI_ASSOC);
            $currentUser=$row[0];
            if($check==true){
                setcookie('uid', $currentUser['uid'], time() + 3600*24*7, '/');
                setcookie('username', $currentUser['username'], time() + 3600*24*7, '/');
                echo $username;
            }
        }else{
            echo false;
        }
    }
?>