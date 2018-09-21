jQuery($=>{

    let username=getUrl("username");
    if(username){
        console.log(username);
        $('#name').css('display', 'inline-block').html(username);
        $('#login').css('display', 'none');
        $('#reg').css('display', 'none');
        $('#out').css('display', 'inline-block');

        // 退出登录
        $('#out').click(function() {
            $('#name').css('display', 'none');
            $('#login').css('display', 'inline-block');
            $('#reg').css('display', 'inline-block');
            $('#out').css('display', 'none');
            location.href="http://localhost:18051/index.html";
        });

        // 跳到列表页
        $('nav').on('click','a',function(e){
            console.log(666);
            let params=encodeURI(this.innerText);
           location.href='http://localhost:18051/html/goodslists_page.html?username='+username+'&name='+params;
        });

    // 跳到列表页
        $('nav').on('click','a',function(e){
            let params=encodeURI(this.innerText);
           location.href='http://localhost:18051/html/goodslists_page.html?username='+username+'&name='+params;
        });

    // 跳到详情页
        $('#hotSales').delegate('.ToDetail','click',function(e){
            let id=$(this).closest('li').attr('id');
            id=encodeURI(id);
            console.log(id);
           location.href='http://localhost:18051/html/detail_page.html?username='+username+'&id='+id;
        });

    // 跳到详情页
        $('.otherItems').delegate('.ToDetail','click',function(e){
            let id=$(this).closest('li').attr('id');
            id=encodeURI(id);
            console.log(id);
           location.href='http://localhost:18051/html/detail_page.html?username='+username+'&id='+id;;
        });

    // 跳到详情页
        $('#recommend').delegate('.ToDetail','click',function(e){
            let id=$(this).closest('li').attr('id');
            id=encodeURI(id);
            console.log(id);
           location.href='http://localhost:18051/html/detail_page.html?username='+username+'&id='+id;;
        });

    // 跳到结算页面
        $('.ToCheckout').click(function() {
           location.href='http://localhost:18051/html/shoppingCar.html?username='+username;
        });

    }else{

        // 跳到列表页
            $('nav').on('click','a',function(e){
                let params=encodeURI(this.innerText);
               location.href='http://localhost:18051/html/goodslists_page.html?name='+params;
            });

        // 跳到详情页
            $('#hotSales').delegate('.ToDetail','click',function(e){
                let id=$(this).closest('li').attr('id');
                id=encodeURI(id);
                console.log(id);
               location.href='http://localhost:18051/html/detail_page.html?id='+id;
            });

        // 跳到详情页
            $('.otherItems').delegate('.ToDetail','click',function(e){
                let id=$(this).closest('li').attr('id');
                id=encodeURI(id);
                console.log(id);
               location.href='http://localhost:18051/html/detail_page.html?id='+id;
            });

        // 跳到详情页
            $('#recommend').delegate('.ToDetail','click',function(e){
                let id=$(this).closest('li').attr('id');
                id=encodeURI(id);
                console.log(id);
               location.href='http://localhost:18051/html/detail_page.html?id='+id;
            });

        // 跳到结算页面
            $('.ToCheckout').click(function() {
               location.href="http://localhost:18051/html/login.html";
            });
    }


    let datalist='';
    // 发送请求获取数据库所有数据，生成页面
        $.ajax({
            url: '../api/index.php',
            type: 'get',
            data: {'goodslists': 'goodslists'},
        })
        .success(function(str) {
            datalist=JSON.parse(str);
            datalist=datalist.data;
            console.log(datalist);
            create_all_hotSales(datalist);
            create_otherItems(datalist);
        });

    // 热销榜单商品
        function create_all_hotSales(datalist){
            console.log(datalist);

            let all_hotSales='';
            for(let i=0;i<5;i++){
                content=`<li id="${datalist[i].id}"><a href="#" class="ToDetail">
                            <img src="${datalist[i].imagesMain}">
                            <p class="title">${datalist[i].title}</p>
                            <p class="price">￥ ${datalist[i].mallPrice}</p>
                        <div class="buy_now">立即购买</div>
                        </a></li>

                `
                all_hotSales+=content;
                // console.log(content);
            }
            $('#hotSales').html(all_hotSales);
            $('#recommend').html(all_hotSales);
        }
    
    // 其它分类商品
        function create_otherItems(datalist){
            console.log(datalist);
            let otherItems='';
            for(let i=0;i<5;i++){
                other_content=`<li id="${datalist[i].id}">
                            <a href="#" class="ToDetail">
                            <img src="${datalist[i].imagesMain}">
                            <p class="title">${datalist[i].title}</p>
                            </a>
                         </li>
                `
                otherItems+=other_content;
                // console.log(other_content);
            }
            $('.otherItems').html(otherItems);
        }



    // 显示购物车弹窗
        let isClick=true;
        $('.showCar').click(function(){
            if(isClick===true){
                $('.bigCar').css('display', 'block');

            }else{
                $('.bigCar').css('display', 'none');
            }
            isClick=!isClick;
        });
        $('.hide').click(function() {
            if(isClick===true){
                $('.bigCar').css('display', 'block');
            }else{
                $('.bigCar').css('display', 'none');
            }
            isClick=!isClick;
        });
     
    // 生成购物车页面
        init();
        function init(){
            $.ajax({
                url: '../api/shoppingCar.php',
                type: 'get',
                data: {'all': 'all'},
            })
            .success(function(str) {
                init_goods=JSON.parse(str);
                renderCar(init_goods);
            });
        }

        function renderCar(all_shopping_goods){
            if(all_shopping_goods==''){
                $('#shoppingBox').html('<p class="nothing">暂无商品</p>');
            }else{
                let allprice=0;
                $('.shoppingBox').html(all_shopping_goods.map(function(index, elem) {
                        let imgurl=index.imagesMain.replace('imagesgoodslists','');
                            allprice+=index.mallPrice*index.qty;
                            return `<li id="${index.id}">
                                        <a href="#"><img class="carImg" src="../images/goodslists/${imgurl}"/></a>
                                        <p class="carTitel"><a href="#">${index.title}</a></p>
                                        <p class="carPrice">
                                            <span>${index.mallPrice} </span>
                                            <span>&times; ${index.qty}</span>
                                        </p>
                                        <span class="carDel"><a href="#">X</a></span>
                                    </li>
                            `
                        }).join(''));
                    $('.allprice').html('￥'+allprice.toFixed(2));
                }
        }

    // 删除单个商品
        $('main').delegate('.carDel', 'click', function() {
            // 找到id，发送到到数据库
            let delId=$(this).closest('li').attr('id');
            console.log(delId);
            $.ajax({
                url: '../api/shoppingCar.php',
                type: 'get',
                data: {'delId': delId},
            })
            .success(function(str) {
                // 重新渲染
                init();
            })  
        });


    // 跳到注册页面
    $('#reg').click(function() {
        location.href="http://localhost:18051/html/register.html";
    });

    // 跳到登录页面
    $('#login').click(function() {
        location.href="http://localhost:18051/html/login.html";
    });


    // 回到顶部
    $('#toTop').click(function() {
        $('html,body').animate({scrollTop:0}, 1000);
    });

   
})