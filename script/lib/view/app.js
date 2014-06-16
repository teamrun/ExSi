(function(){

    var _class = {
        workerItem: 'worker-item'
    }

    var posArr, rect;

    function detectCollision(box1,box2){
        console.log( box1,box2 )
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

    function genWorkerPosArr(){
        var $eles = $('.'+_class.workerItem);
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
                el.el.addClass('isin');
            }
            else{
                el.el.removeClass('isin');
            }
        })
    }

    var data = {
        profession: {
            '001': '小工',
            '002': '大工',
            '101': 'hacker'
        },
        worker: [
            {
                name: '张三',
                pro: '001'
            },
            {
                name: 'Reese',
                pro: '002'
            },
            {
                name: 'Finch',
                pro: '101'
            }
        ]
    };

    var workerVM, professionVM;

    avalon.ready(function(){
        workerVM = avalon.define('worker', function(vm){
            vm.man = data.worker;
        });

        avalon.scan();
    });

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
            drawCallback: drawCallback
        };
        // 鼠标选区
        rect = new window.MouseRect(opt);

        setTimeout(function(){
            posArr = genWorkerPosArr();
        }, 1000);
    }

    init();
})()