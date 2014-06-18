(function(){

    var _class = {
        item: 'worker-item',
        itemSelected: 'selected'
    }

    var items;
    var posArr, rect, mouseDownMoved;

    function detectCollision(box1,box2){
        // console.log( box1,box2 )
        /*
            A ----------- B
              |         |
              |         |
            D ----------- C
        */
        if(  (box2.A.y < box1.D.y && box2.D.y > box1.A.y) && ( box2.A.x < box1.B.x && box2.B.x > box1.A.x )  ){
            return true;
        }
        return false;
    }

    function genWorkerPosArr($eles){
        // 由于高度是统一的, 所以有一个H
        var H = $eles.eq(0).height();
        var W = $eles.eq(0).width();
        var posArr = [];
        $eles.each(function(index){
            var offset = $($eles[index]).offset();
            posArr.push({
                el: $eles.eq(index),
                A: {x: offset.left, y: offset.top},
                B: {x: offset.left+W, y: offset.top},
                D: {x: offset.left, y: offset.top+H},
            })
        });
        return posArr;
    }

    function drawCallback( styleObj ){
        // console.log(styleObj);
        var rectBox = {
            A: {x: styleObj.left, y: styleObj.top},
            B: {x: styleObj.left+styleObj.width, y: styleObj.top},
            D: {x: styleObj.left, y: styleObj.top+styleObj.height }
        };
        posArr.forEach(function(el,i,arr){
            if(detectCollision(rectBox, el)){
                el.el.addClass(_class.itemSelected);
            }
            else{
                el.el.removeClass(_class.itemSelected);
            }
        })
    }

    /*
     * 多种组合的配合...
     * 
     * 点击: 激活自己, 清除其余
     * ctrl + 点击: toggle自己, 不要管别人
     * 
     * 滑选: 激活选中, 清除其余
     * ctrl + 划选: toggle选中, 不管别人
     * 
     */

    var _event = {
        // keyboard事件 metaKey 比较复杂  明天再搞
        // and mousedown 发生在item上时```怎么搞?
        // 虽然genPos方法的存在使得item不一定非得按float排`` 但是```
        itemClickHandler: function(e){
            e.preventDefault();
            console.log(e);
            var item = $(this);
            if( e.ctrlKey || e.metaKey ){
                if( item.hasClass(_class.itemSelected) ){
                    item.removeClass(_class.itemSelected);
                }
                else{
                    item.addClass(_class.itemSelected);
                }
            }
            else{
                _event.unSelectAll();
                item.addClass(_class.itemSelected);
            }

            
            
            e.stopPropagation();
        },
        unSelectAll: function(){
            items.removeClass( _class.itemSelected );
        }
    }

    function init(){
        /* 
         * 鼠标选区 + 碰撞检测 + 
         * item点击选择 + 辅助键点击 + 
         * 空白区域点击取消选择
         * 
        */ 
        var opt = {
            ctn: 'body',
            // 碰撞检测
            drawCallback: function(styleObj){
                drawCallback(styleObj);
                // 添加一个状态值: mousedown -> move -> up 后
                // 不触发click空白区域的清空事件
                mouseDownMoved = true;
            }
        };
        // 鼠标选区
        rect = new window.MouseRect(opt);
        // 事件绑定: item点选, 右键屏蔽+自定义, 空白区点击取消选择
        rect.ctn.delegate('.'+_class.item, 'click', _event.itemClickHandler);
        rect.ctn.bind('contextmenu', function(e){
            e.preventDefault();
        });
        rect.ctn.bind('click', function(){
            if(mouseDownMoved){
                mouseDownMoved = false;
            }
            else{
                _event.unSelectAll();
            }
        });

        setTimeout(function(){
            items = rect.ctn.find('.'+_class.item);
            posArr = genWorkerPosArr( items );
        }, 1000);
    }

    init();
})()