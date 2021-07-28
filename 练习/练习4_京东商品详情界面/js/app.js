/*
 1. 鼠标移入显示,移出隐藏
 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)

 9. 点击向右/左, 移动当前展示商品的小图片
 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */

/*
  1. 对哪个/些元素绑定什么监听?
  2. 对哪个/些元素进行什么DOM操作?
 */

$(function () {
    showhide()
    hoverSubMenu()
    search()
    share()
    address()
    clickTabs()
    minicart()
    product_options()
    moveMiniImg()
    hoverMiniImg()
    bigImg()
    // 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
    function bigImg() {
        var $mediumImg = $('#mediumImg') //img大图
        var $mask = $('#mask') //小黄块
        var $maskTop = $('#maskTop') //图片大小的span
        var $largeImgContainer = $('#largeImgContainer') //右侧-放大镜的图片
        var $loading = $('#loading') //正在加载的gif图
        var $largeImg = $('#largeImg')  //
        var maskWidth = $mask.width() //小黄块宽
        var maskHeight = $mask.height() //小黄快高
        var maskTopWidth = $maskTop.width() //图片大小的span的宽度
        var maskTopHeight = $maskTop.height() //图片大小的span的高度

        $maskTop.hover(function () {    //进入
            $mask.show()    //小黄块显示

            //动态加载对应的大图
            var src = $mediumImg.attr('src').replace('-m', '-l')
            $largeImg.attr('src', src)
            $largeImgContainer.show()
            //绑定加载完成的监听
            $largeImg.on('load', function () {

                //得到大图的尺寸
                var largeWidth = $largeImg.width()
                var largeHeight = $largeImg.height()

                //给$largeImgContainer设置尺寸
                $largeImgContainer.css({
                    width: largeWidth / 2,
                    height: largeHeight / 2
                })
                //显示大图
                $largeImg.show()
                //隐藏加载进度条
                $loading.hide()
                //鼠标移动的监听
                $maskTop.mousemove(function (event) {   //第一步
                    /*
                        1.移动小黄块
                        2.移动大图 
                     */
                    /* 1.移动小黄块 */
                    //计算left/top
                    var left = 0    //声明一个left
                    var top = 0
                    //事件的坐标
                    var eventLeft = event.offsetX       //大图一样大的span 触发事件的坐标
                    var eventTop = event.offsetY
                    left = eventLeft - maskWidth / 2    //mask是小黄快的宽度
                    top = eventTop - maskHeight / 2
                    //left在(0,maskTopWidth-maskWidth)
                    if (left < 0) {
                        left = 0
                    } else if (left > maskTopWidth - maskWidth) {
                        left = maskTopWidth - maskWidth
                    }
                    //top在(0,maskTopHeight-maskHeight)
                    if (top < 0) {
                        top = 0 //等于0防止小黄快跑出去
                    } else if (top > maskTopHeight - maskHeight) {
                        /*
                           大span 高是350 小黄块是 175
                           它们差是 175 就说明最大top值是175 如果大于他们的差就会溢出去
                           所有top等于 maskTopHeight - maskHeight
                         */
                        top = maskTopHeight - maskHeight
                    }
                    //给$mask重新定位
                    $mask.css({
                        left: left,
                        top: top
                    })
                    // 2.移动大图 
                    //得到大图的坐标
                    left = -left * largeWidth / maskTopWidth
                    top = -top * largeHeight / maskTopHeight

                    //设置大图的坐标
                    $largeImg.css({
                        left: left,
                        top: top
                    })
                })
            })
        }, function () {
            $mask.hide()    //小黄块显示
            $largeImgContainer.hide()
            $largeImg.hide()
        })
    }
    // 10. 当鼠标悬停在某个小图上,在上方显示对应的中图
    function hoverMiniImg() {
        $('#icon_list>li').hover(function () {
            var $img = $(this).children()
            $img.addClass('hoveredThumb')
            //显示对应的图片
            var src = $img.attr('src').replace('.jpg', '-m.jpg')
            $('#mediumImg').attr('src', src)
        }, function () {
            $(this).children().removeClass('hoveredThumb')
        })
    }

    // 9. 点击向右/左, 移动当前展示商品的小图片
    function moveMiniImg() {
        var as = $('#preview>h1>a')
        var $backward = as.first()
        var $forward = as.last()
        var $Ul = $('#icon_list')
        var SHOW_COUNT = 5
        var imgCount = $Ul.children('li').length
        var moveCount = 0   //移动的次数(向右为正，向左为负)
        var liWidth = $Ul.children(':first').width()

        //初始化更新
        if (imgCount > SHOW_COUNT) {
            //如果图片长度比显示的出来的多,说明可以点击右侧按钮
            $forward.attr('class', 'forward')
        }

        //给右侧的按钮绑定点击监听
        $forward.click(function () {
            if (moveCount === imgCount - SHOW_COUNT) {
                return
            }
            moveCount++
            //更新向左的按钮
            $backward.attr('class', 'backward')
            //更新向右的按钮
            if (moveCount === imgCount - SHOW_COUNT) {
                $forward.attr('class', 'forward_disabled')
            }
            //移动ul
            $Ul.css({
                left: -moveCount * liWidth
            })
        })
        //给左侧的按钮绑定点击监听
        $backward.click(function () {
            if (moveCount === 0) {
                return
            }
            moveCount--
            //更新向左的按钮
            $forward.attr('class', 'forward')
            //更新向右的按钮
            if (moveCount === 0) {
                $backward.attr('class', 'backward_disabled')
            }
            //移动ul
            $Ul.css({
                left: -moveCount * liWidth
            })
        })
    }

    // 8. 点击切换产品选项 (商品详情等显示出来)
    function product_options() {
        var $main_tabs = $('#product_detail>ul>li')
        var $product_detail = $('#product_detail>div:not(:first)')
        var index = 0
        $main_tabs.click(function () {
            $main_tabs.eq(index).attr('class', '')
            $product_detail.eq(index).hide()
            var nowIndex = $(this).index()
            $main_tabs.eq(nowIndex).attr('class', 'current')
            $product_detail.eq(nowIndex).show()
            index = nowIndex
        })
    }


    //  7. 鼠标移入移出切换显示迷你购物车
    function minicart() {
        $('#minicart').hover(function () {
            // this.className = 'minicart'
            // this.setAttribute('class','minicart')
            $(this).addClass('minicart')
            $(this).children('div').show()
        }, function () {
            // this.className = ''
            // this.removeAttribute('class')
            $(this).attr('class', '')
            $(this).children('div').hide()
        })
    }
    // 6. 点击切换地址tab
    function clickTabs() {
        $('#store_tabs>li').click(function () {
            // $('#store_tabs>li').removeClass('hover')
            $('#store_tabs>li').attr('class', '')
            // $(this).addClass('hover')
            this.className = 'hover'
        })
    }
    // 5. 鼠标移入移出切换地址的显示隐藏
    function address() {
        var $select = $('#store_select')
        var $store_close = $('#store_close')
        $select.hover(function () {
            $(this).children(':gt(0)').show()
        }, function () {
            $(this).children(':gt(0)').hide()
        })
        $store_close.click(function () {
            $select.children(':gt(0)').hide()
        })
    }
    //  4. 点击显示或者隐藏更多的分享图标
    function share() {
        var isOpen = false //标识当前状态(初始为关闭)
        var $shareMore = $('#shareMore')
        var $parent = $shareMore.parent()
        var $as = $shareMore.prevAll('a:lt(2)')
        var $b = $shareMore.children()
        $('#shareMore').click(function () {
            if (isOpen) {  //关闭
                $parent.css('width', 155)
                $as.hide()
                $b.removeClass('backword')
                // isOpen = false  
            } else {   //打开
                $parent.css('width', 200)
                $as.show()
                $b.addClass('backword')
                // isOpen = true
            }
            isOpen = !isOpen
        })
    }

    // 3. 输入搜索关键字, 列表显示匹配的结果
    function search() {
        $('#txtSearch').on('keyup focus', function () {
            var txt = this.value.trim()
            if (txt) {
                $('#search_helper').show()
            }
        }).blur(function () {
            $('#search_helper').hide()
        })
    }
    /* 2. 鼠标移动切换二级导航菜单的切换显示和隐藏 */
    function hoverSubMenu() {
        $('.cate_item').hover(function () {
            $(this).children(':last').show()
        }, function () {
            $(this).children(':last').hide()
        })
    }
    /* 
      1. 鼠标移入显示,移出隐藏
        目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
    */
    function showhide() {
        $('[name=show_hide]').hover(function () {
            var id = this.id + '_items'
            $('#' + id).show()
        }, function () {
            var id = this.id + '_items'
            $('#' + id).hide()
        })
    }
})
