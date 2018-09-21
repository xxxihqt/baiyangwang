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


    // 获取前端返回的参数
    $goodslists=isset($_GET['goodslists'])?$_GET['goodslists']:null;
    $id=isset($_GET['id'])?$_GET['id']:null;
    $page=isset($_GET['page'])?$_GET['page']:null;

    $qty=15;
    // 获取数据库全部商品
    if($goodslists){
        // (4)编写sql语句
        $sql='select * from goodslists';

        //（5）获取查询结果集
        $result = $conn->query($sql);

        //（6）使用查询结果集
        //得到数组
        $row = $result->fetch_all(MYSQLI_ASSOC);
        // $row1=array_slice($row,($page-1)*$qty, $qty);
        $res=array(
            'total'=>count($row),
            'data'=>array_slice($row,0, $qty)
        );
        //（8）把结果输出到前台
        echo json_encode($res,JSON_UNESCAPED_UNICODE);
    }

    // 获取当前id的商品
    if($id){
        $sql="select * from goodslists where id='$id'";
        $result = $conn->query($sql);
        $row = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($row);
    }

    if($page){
    //      // (4)编写sql语句
        $sql_page='select * from goodslists';

    //     //（5）获取查询结果集
        $result_page= $conn->query($sql_page);

    //     //（6）使用查询结果集
    //     //得到数组
        $row_page = $result_page->fetch_all(MYSQLI_ASSOC);
 
         $row_page1=array_slice($row_page,($page-1)*$qty, $qty);
         // var_dump($row_page1);
    //     //（8）把结果输出到前台
        echo json_encode($row_page1,JSON_UNESCAPED_UNICODE);
    }

    //（7）释放查询结果集，避免资源浪费
    // $result->close();
    
    // （9）关闭数据库，避免资源浪费
    // $conn->close();

?>