(function(){

    var _id = {

    }
    var _class = {

    }

    var doc, simuCtn
    var sArea, members, memberCount

    var flag = false;
    var X, Y;

    var config = {
        mw: 80,
        mh: 100
    };

    var _event = {
        bind: function(){
            simuCtn.bind('mousedown', _event.startRect);
            simuCtn.bind('mousemove', _event.drawAndDetect);
            simuCtn.bind('mouseup',   _event.endRect);
        },
        startRect: function(e){
            _view.setStartPos( e );
            _view.showSelectArea();
            _view.setUnselect();
            flag = true;
        },
        drawAndDetect: function(e){
            if( flag ){
                _view.setWH( e );
                // suber();
            }
        },
        endRect: function(e){
            _view.hideSelectArea();
            flag = false;
        }
    };


    var _view = {
        showSelectArea: function(){
            sArea.css('display', 'block');
        },
        hideSelectArea: function(){
            setTimeout( function(){
                sArea.css('display', 'none');
                sArea.css('width', '0px');
                sArea.css('height', '0px');
            }, 60);
        },
        setStartPos: function(e){
            X = e.offsetX;
            Y = e.offsetY;
            sArea.css('top', Y + 'px');
            sArea.css('left', X + 'px');
            // console.log( X, Y );

            sArea.css('width', 0);
            sArea.css('height', 0);
        },
        setWH: function(e){
            var w = e.offsetX - X;
            var h = e.offsetY - Y;
            console.log(X,Y)

            if( w < 0){
                console.log( '向左划...' );
                // console.log( X + w );
                // 从鼠标起始点开始计算
                // sArea.css('left', X + w + 'px');
            }
            sArea.css('width', Math.abs(w) + 'px');

            if( h < 0 ){
                // sArea.css('top', Y + h + 'px');
            }
            sArea.css('height', Math.abs(h) + 'px');
        },
        setUnselect: function(){
            for( var i=0; i<memberCount; i++ ){
                members[i].className = 'file-ctn';
            }
        }
    };


    
    function suber(){
        // console.log( members[0].offsetTop );
        // console.log( members[0].offsetLeft );

        var xLeft = getStyleVal( sArea.css('left') );
        var xRight = xLeft + getStyleVal(  sArea.css('width') );

        var yTop = getStyleVal(  sArea.css('top') );
        var yBottom = yTop + getStyleVal(  sArea.css('height') );

        var a = {
            xLeft: xLeft,
            xRight: xRight,
            yTop: yTop,
            yBottom: yBottom
        };

        // console.log( xLeft + ' : ' + xRight );

        for( var i=0; i<memberCount; i++ ){
            var mx = members[i].offsetLeft;
            var my = members[i].offsetTop;
            var m = {
                mx: mx,
                my: my
            }

            if( isIn( m, a ) ){
                members[i].className = 'file-ctn isin';
            }
            else{
                members[i].className = 'file-ctn';
            }
        }
    }

    function getStyleVal( styleValStr ){
        return Number( styleValStr.substr( 0, styleValStr.length-2 ) );
    }

    function isIn( m, a ){
        /* --------- 只判断了四个角的点... --------- */
            // // north west
            // if( m.mx>a.xLeft && m.mx<a.xRight && m.my>a.yTop && m.my<a.yBottom ){
            //     return true;
            // }
            // // north east
            // var tmpX = m.mx+mw;
            // if( tmpX>a.xLeft && tmpX<a.xRight && m.my>a.yTop && m.my<a.yBottom ){
            //     return true;
            // }
            // // south east
            // var tmpY = m.my+mh;
            // if( tmpX>a.xLeft && tmpX<a.xRight && tmpY>a.yTop && tmpY<a.yBottom ){
            //     return true;
            // }
            // // south west
            // if( m.mx>a.xLeft && m.mx<a.xRight && tmpY>a.yTop && tmpY<a.yBottom ){
            //     return true;
            // }
        /* --------- end of 只判断了四个角的点... --------- */

        /* --------- 判断两个盒子的碰撞 --------- */
        /*
            A ----------- B
              |         |
              |         |
            D ----------- C

        */

        var A = { x: a.xLeft, y: a.yTop },
            B = { x: a.xRight, y: a.yTop },
            C = { x: a.xRight, y: a.yBottom },
            D = { x: a.xLeft, y: a.yBottom };

        var mA = { x: m.mx, y: m.my },
            mB = { x: m.mx+config.mw, y: m.my },
            mC = { x: m.mx+config.mw, y: m.my+config.mh },
            mD = { x: m.mx, y: m.my+config.mh };

        if(   (mA.y < D.y && mD.y > A.y) && ( mA.x<B.x && mB.x>A.x )    ){
            return true;
        }
        return false;
    }

    function init(){
        doc=$(document.body)
        sArea = $('.select-area')
        members = $('.file-ctn' )
    
        memberCount = members.length
        simuCtn = doc


        _event.bind();
    }

    init();
})()