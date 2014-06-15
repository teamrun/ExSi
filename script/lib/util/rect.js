(function(){

    var style = document.createElement('style');
    style.innerHTML = '#m-rect-dom{border-radius: 4px;width: 0px;height:0px;background: rgba(50,50,50,0.25);}';
    document.body.appendChild(style)

    if( !Function.bind ){
        Function.prototype.bind = function( _this ){
            return function(args){
                this.apply(_this, [args])
            }
        }
    }

    function getStyleValue( valueStr ){
        return Number(valueStr.substr(0, valueStr.length-2))
    }

    var RECT_ID = 'm-rect-dom'
    window.MouseRect = function( opt ){
        this.ctn = $(opt.ctn);

        var rectEle = $(document.createElement('div'));
        rectEle.attr('id', RECT_ID);
        this.ctn.append(rectEle);
        rectEle.css('position', 'absolute');
        this.rectEle = rectEle;

        this.startX = 0;
        this.startY = 0;
        this.monitFlag = false;

        this.bind();

        return this;
    }

    MouseRect.prototype.bind = function() {
        var self = this
        this.ctn.bind('mousedown', startRect.bind(this) );
        this.ctn.bind('mousemove', function(e){
            if(self.monitFlag){
                drawRect.bind(self)(e, this.drawCallback);
            }
        });
        this.ctn.bind('mouseup', endRect.bind(this));
    };

    MouseRect.prototype.doneRect = function() {
        this.monitFlag = false;
        this.rectEle.css({
            width: 0,
            height: 0
        });
    }

    function startRect(e){
        this.monitFlag = true;
        // console.log(e) 
        // offsetX/Y 基于父级中"定位"(pos值为relative or abs)了的元素的位置
        console.log('set rect start: ', e.offsetX, e.offsetY )
        this.startX = e.offsetX
        this.startY = e.offsetY
        this.rectEle.css({
            top:  this.startY,
            left: this.startX
        })
    }
    function drawRect(e, callback){
        var styleObj = {}
        // 鼠标滑动速度过快或者发生急速的变相时,指针会到rect上去
        // 此时的offset的基准会发生变化...
        if( $(e.target).attr('id') == RECT_ID ){
            console.log('冒泡');
            styleObj = {
                width: e.offsetX,
                height: e.offsetY,
            };
            // 右下向左上划时...
            var cur = {
                top: getStyleValue(this.rectEle.css('top')),
                left: getStyleValue(this.rectEle.css('left')),
                width: getStyleValue(this.rectEle.css('width')),
                height: getStyleValue(this.rectEle.css('height'))
            };
            if(cur.top != this.startY){
                // console.log( cur.top + e.offsetY )
                // console.log( cur.height - e.offsetY )
                styleObj.top = cur.top + e.offsetY
                styleObj.height = cur.height - e.offsetY;
            }
            if(cur.left != this.startX){
                styleObj.left = cur.left + e.offsetX;
                styleObj.width = cur.width - e.offsetX;
            }
        }
        else{
            var deltaX = e.offsetX - this.startX;
            var deltaY = e.offsetY - this.startY;
            // console.log('rect W: %d ,H: %d', deltaX, deltaY);
            styleObj = {
                width: Math.abs(deltaX),
                height: Math.abs(deltaY),
            };
            // 右下向左上划时...
            if(deltaX < 0){
                styleObj.left = e.offsetX
            }
            if(deltaY < 0){
                styleObj.top = e.offsetY
            }
        }
        // 直接赋值css会有bug jquery的bug
        for(var i in styleObj){
            this.rectEle.css(i, styleObj[i]);
        }
        if(callback instanceof Function){
            callback(styleObj);
        }
    }
    function endRect(e){
        this.doneRect();
    }
})()