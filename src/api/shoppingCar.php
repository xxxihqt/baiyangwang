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

    // (3)查询前设置编码，防止乱码
    $conn->set_charset('utf8');

    $current_goods=isset($_GET['current_goods'])?$_GET['current_goods']:null;
    $all=isset($_GET['all'])?$_GET['all']:null;
    $delId=isset($_GET['delId'])?$_GET['delId']:null;
    $add=isset($_GET['add'])?$_GET['add']:null;
    $remove=isset($_GET['remove'])?$_GET['remove']:null;


    if($current_goods){ 
            $current_goods=json_decode($current_goods);
            $id=$current_goods->id;
            $qty=$current_goods->qty*1;
            $sql="select * from shoppinglists where id='$id'";
             //（5）获取查询结果集
            $result = $conn->query($sql);
 
            if($result->num_rows>0){

                // 如果已经存在，就数量加1
                $sql1="update shoppinglists set qty=qty+1 where id=$id";
                $result1=$conn->query($sql1);

            }else{

                // (4)编写sql语句
                $sql = "INSERT INTO shoppinglists (id, classify, subdivide1,subdivide2,title,intro,marketingPrice,mallPrice,grade,freight,Taxes,qty,Sales,evaluate,hot,origin,ItemNo,brand,imagesMain,img1,img2) VALUES (";
                foreach ($current_goods as $item) {
                    $sql .= "'$item',"; 
                }
                $sql = substr($sql,0,-1);
                $sql.=")";
                // echo($sql);
                
                $result1 = $conn->query($sql); 
            }

            // 获取所有购物车商品
            $sql_all='select * from shoppinglists';
            $result_all = $conn->query($sql_all);
            $row = $result_all->fetch_all(MYSQLI_ASSOC);

             //（6）使用查询结果集,得到数组
            echo json_encode($row);

            $result_all->close(); 
            $conn->close();
    }

    if($all){
         $sql_all='select * from shoppinglists';
            $result_all = $conn->query($sql_all);
            $row = $result_all->fetch_all(MYSQLI_ASSOC);

             //（6）使用查询结果集,得到数组
            echo json_encode($row);

            $result_all->close(); 
            $conn->close();
    }

    if($delId){
        $sqlDEL="delete from shoppinglists where id='$delId'";
        $resultEDL = $conn->query($sqlDEL);
        echo 'DELdone';
    }

    if($add){
        $id=isset($_GET['id'])?$_GET['id']:null;
        $qty=isset($_GET['qty'])?$_GET['qty']:null;
        $sql="update shoppinglists set qty=$qty where id=$id";
        $result = $conn->query($sql);

        if($result){
        }else{
            echo false;
        }
    }

    if($remove){
        $id=isset($_GET['id'])?$_GET['id']:null;
        $qty=isset($_GET['qty'])?$_GET['qty']:null;
        $sql="update shoppinglists set qty=$qty where id=$id";
        $result = $conn->query($sql);

        if($result){
        }else{
            echo false;
        }
    }
?>