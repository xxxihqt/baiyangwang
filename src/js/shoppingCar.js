jQuery($=>{

    let username=getUrl("username");

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
            location.href="http://localhost:18051/html/login.html";
        });
    }

    // 跳到首页
        $('.logo').click(function() {
            if(username){
                location.href="http://localhost:18051/index.html?username="+username;
            }else{
                location.href="http://localhost:18051/index.html?";
            }
        });

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
            console.log(init_goods);

        });
    }
    function renderCar(all_shopping_goods){
            $('.progress li:first-child').addClass('current');

            if(all_shopping_goods==''){
                $('.none').css('display', 'block');
            }else{
                $('.shoppingcar').css('display', 'block');
                let allprice=0;
                $('.items').html(all_shopping_goods.map(function(index, elem){
                    let imgurl=index.imagesMain.replace('imagesgoodslists','');
                        allprice+=index.mallPrice*index.qty;
                        let littleSum=(index.mallPrice*index.qty).toFixed(2);
                        return `
                            <tr data-guid="${index.id}">
                            <td class="check">
                                <input type="checkbox" class="checkbox"/>
                            </td>
                            <td class="imgMain">
                                <img src="../images/goodslists/${imgurl}" alt="" />
                            </td>
                            <td class="title">
                                <p>${index.title}</p>
                                <span></span>
                            </td>
                            <td class="price">
                                <span>${index.mallPrice}</span>
                                <span>(税费0.00元)</span>
                            </td>
                            <td class="qty">
                                <p>
                                <span class="good_del">-</span>
                                <span id="qty">${index.qty}</span>
                                <span class="addnum">+</span>
                                </p>
                            </td>
                            <td class="littleSum">
                                <span id="currentSum">${littleSum}</span>
                            </td>
                            <td class="choose">
                                <span><a href="#">移入收藏夹</a></span>
                                <span id="del"><a href="#">删除</a></span>
                            </td>
                            </tr>
                        `
                }).join(''));
            }
    }

    // 购物车操作
    $('#allchecked').click(function() {
        var $checkboxs=$('.items .checkbox');
         $checkboxs.prop('checked',this.checked);
         sum();
    });

    // 选中数量，是否全选
    $('.items').delegate('.checkbox', 'click', function() {
        checkAll();
        sum();
    });

    // 删除选中
    $('.items').delegate('#del','click',function(){   
        var $checkboxs=$('.items .checkbox');
        var $checked=$checkboxs.filter(':checked');
        // 获取当前商品id
        let currentID=$(this).parent().parent().parent().attr('data-guid');
        // 发送到数据库删除
        $.ajax({
            url: '../api/shoppingCar.php',
            type: 'get',
            data: {'delId': currentID},
        })
        .success(function(str) {
            // 重新渲染
            init();
            sum();

        })
    });

    // 增加数量
    $('.items').delegate('.addnum','click',function(){
        // var $checkboxs=$('.items .checkbox');
        // var $checked=$checkboxs.filter(':checked');
        let currentID=$(this).parent().parent().parent().attr('data-guid');
        let qty=$('#qty').html()*1;
        qty++;
        $('#qty').html(qty);
        console.log(qty);
        addQty(currentID,qty);
    });

    function addQty(currentID,qty){
        $.ajax({
            url: '../api/shoppingCar.php',
            type: 'get',
            data: {
                    'add':'add',
                    'id': currentID,
                    'qty':qty
                },
        })
        .done(function(str) {
            console.log(str);
                init();
                sum();
        }) 
    }

     // 减少数量
    $('.items').delegate('.good_del','click',function(){
        // var $checkboxs=$('.items .checkbox');
        // var $checked=$checkboxs.filter(':checked');
        let currentID=$(this).parent().parent().parent().attr('data-guid');
        let qty=$('#qty').html()*1;
        qty--;
        if(qty<1){
            qty=1;
        }
        $('#qty').html(qty);
        console.log(qty);
        removeQty(currentID,qty);
    });

    function removeQty(currentID,qty){
        $.ajax({
            url: '../api/shoppingCar.php',
            type: 'get',
            data: {
                    'remove':'remove',
                    'id': currentID,
                    'qty':qty
                },
        })
        .done(function(str) {
            console.log(str);
                init();
                sum();
        }) 
    }


    // 全选按钮
    function checkAll(){
        var $checkboxs=$('.items .checkbox');
        // 获取选中的选框
        var $checked=$checkboxs.filter(':checked');
        $('#allchecked').prop('checked',$checked.length===$checkboxs.length);
    }

    // 计算价格
    function sum(){
        var total=0;
        var $checkboxs=$('.items .checkbox');
        var $checked=$checkboxs.filter(':checked');

        // 循环获取选中的小计
        $checked.each(function(index, el) {
            var little_total=$(el).closest('tr').children().find('#currentSum').text()*1;
            console.log(little_total);
            total+=little_total;
        });
        // 写入页面
        $('.total_price').html(total.toFixed(2));

        $('._total').html(total.toFixed(2));             
    }
})