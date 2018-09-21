jQuery($=>{
     let id=getUrl("id");
    let username=getUrl("username");

    $('header').load('common_header.html',function(){
        if(username){
            $('header #name').css('display', 'inline-block').html(username);    
            $('header #login').css('display', 'none');
            $('header #reg').css('display', 'none');
            $('header #out').css('display', 'inline-block');

            // 退出登录
            $('header #out').click(function() {
                $('#name').css('display', 'none');
                $('#login').css('display', 'inline-block');
                $('#reg').css('display', 'inline-block');
                $('#out').css('display', 'none');
                location.href="http://localhost:18051/html/detail_page.html";
            });
        }
        // 跳到注册页面
            $('#reg').click(function() {
                location.href="http://localhost:18051/html/register.html";
            });

        // 跳到登录页面
            $('#login').click(function() {
                location.href="http://localhost:18051/html/login.html";
            });

        // 跳到首页
            $('.toIndex').click(function() {
                if(username){
                    location.href="http://localhost:18051/index.html?username="+username;
                }else{
                    location.href="http://localhost:18051/index.html?";
                }
            });
    });

    $('nav').load('common_nav.html');
    $('footer').load('common_footer.html');

    // 购物车弹窗
    $('.fix_car').load('common_fix_car.html',function(){
        let isClick=true;
        // 显示购物车
        $('.showCar').click(function(){
            if(isClick===true){
                $('.bigCar').css('display', 'block');

            }else{
                $('.bigCar').css('display', 'none');
            }
            isClick=!isClick;
        });

        // 隐藏购物车
        $('.hide').click(function() {
            if(isClick===true){
                $('.bigCar').css('display', 'block');
            }else{
                $('.bigCar').css('display', 'none');
            }
            isClick=!isClick;
        });

        // 跳到结算页面
            $('.ToCheckout').click(function() {
                if(username){
                    location.href='http://localhost:18051/html/shoppingCar.html?username='+username;
                }else{
                    location.href="http://localhost:18051/html/login.html";
                }
            });
             // 回到顶部
            $('#toTop').click(function() {
                $('html,body').animate({scrollTop:0}, 1000);
            });
        });

   
   // 发送请求
   let current_goods='';
    // 发送请求获取数据库所有数据，生成页面
    $.ajax({
        url: '../api/index.php',
        type: 'get',
        data: {'id': id},
    })
    .success(function(str) {
        current_goods=JSON.parse(str);
        current_goods=current_goods[0];
        renderDetail(current_goods);
    });

    function renderDetail(current_goods){
        console.log(current_goods);
        $('.little_main h3').html(`<span>首页 > </span><span>${current_goods.classify} ></span><span>${current_goods.subdivide1} ></span> <span>${current_goods.subdivide2} > </span> <span>${current_goods.title}</span>`);
        $('.mainImg').html(`<img src="../${current_goods.imagesMain}"/>`);
        $('.littleImg').html(`<a href="#"><img src="../${current_goods.imagesMain}"></a>`);
        $('.origin').html(current_goods.origin);
        $('.title').html(current_goods.title);
        $('.intro').html(current_goods.intro);
        $('.marketingPrice').html(`<del>￥ ${current_goods.marketingPrice}</del>`);
        $('.mallPrice').html('￥'+current_goods.mallPrice);
         $('.ToCar').attr('id', current_goods.id);
        // 评分
        let all_grade='';

        for(let i=0;i<current_goods.grade;i++){
            content=`<img src="../images/detail_page/star-on.png"/>`
            all_grade+=content;
        }
        $('.grade').html(all_grade+`<a>共有${current_goods.evaluate}条评价</a><span>(销量:${current_goods.Sales})</span>`);
        $('.hot').html(`收藏商品(${current_goods.hot})`);
        $('.freight').html(current_goods.freight);
        $('.Taxes').html(current_goods.Taxes);
        $('#qty').attr('value',current_goods.qty*1);
    }

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

    // 增加数量
    $('.more').click(function() {
        let num=$('#qty').val();
        num++;
        $('#qty').val(num);
    });

    // 减去数量
    $('.less').click(function() {
        let num=$('#qty').val();
        num--;
        if(num<1){
            num=1;
        }
        $('#qty').val(num);
    });

    // 成功加入购物车弹窗
    $('.ToCar').click(function() {
        //获取商品id发送请求
        let id=$('.ToCar').attr('id');

         $.ajax({
            url: '../api/index.php',
            type: 'get',
            data: {'id': id},
        })
        .success(function(str) {
            current_goods=JSON.parse(str);
            current_goods=current_goods[0];

            // 获取input的数量
            let changeQTY=$('#qty').val()*1;
            current_goods.qty=current_goods.qty*1+changeQTY;
            sendToCar(current_goods);
        });

        function sendToCar(current_goods){
                let new_current_goods=JSON.stringify(current_goods);
                $.ajax({
                    url: '../api/shoppingCar.php',
                    type: 'get',
                    data: {'current_goods':new_current_goods},
                })
                .success(function(str) {

                    all_shopping_goods=JSON.parse(str);
                    
                    renderCar(all_shopping_goods);
                    init();
                });
            }

        $('.DoneCar').css('display', 'block');
    });


    // 成功加入购物车弹窗
    $('.DoneCar .move').click(function() {
        $('.DoneCar').css('display', 'none');
    });


})