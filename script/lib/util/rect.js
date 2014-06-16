(function(){

    var style = document.createElement('style');
    style.innerHTML = '#m-rect-dom{border-radius: 4px;width: 0px;height:0px;background: rgba(50,50,50,0.25);}';
    style.innerHTML += '.rect-ctn{position:relative; user-select:none;}';
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

    var RECT_ID = 'm-rect-dom';
    var RECT_CTN_CLASS = 'rect-ctn';
    window.MouseRect = function( opt ){
        this.ctn = $(opt.ctn);
        this.ctn.addClass(RECT_CTN_CLASS);

        this.drawCallback = opt.drawCallback;

        var rectEle = $(document.createElement('div'));
        rectEle.attr('id', RECT_ID);
        this.ctn.append(rectEle);
        rectEle.css('position', 'absolute');
        this.rectEle = rectEle;

        this.startX = 0;
        this.startY = 0;

        this.updateCtnPos();
        this.monitFlag = false;

        this.bind();

        return this;
    };

    MouseRect.prototype.updateCtnPos = function() {
        this.ctnPos = this.ctn.offset();
    }

    MouseRect.prototype.bind = function() {
        var self = this
        this.ctn.bind('mousedown', startRect.bind(this) );
        this.ctn.bind('mousemove', function(e){
            if(self.monitFlag){
                drawRect.bind(self)(e, self.drawCallback);
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

    function getOffset(el){

    }
    function startRect(e){
        this.monitFlag = true;
        // console.log(e) 
        // offsetX/Y 基于父级中"定位"(pos值为relative or abs)了的元素的位置
        // 当ctn中有其他dom时会出现offset基准变更的问题, 所以干脆用pageX
        console.log('set rect start: ', e.pageX, e.pageY )
        this.startX = e.pageX - this.ctnPos.left;
        this.startY = e.pageY - this.ctnPos.top;
        this.rectEle.css({
            top:  this.startY,
            left: this.startX
        })
    }
    function drawRect(e, callback){
        var styleObj = {}
        // 鼠标滑动速度过快或者发生急速的变相时,指针会到rect上去
        // 此时的offset的基准会发生变化...
        // 干脆换用pageX
        // mousePos relative to this.ctn
        var mousePosX = e.pageX - this.ctnPos.left;
        var mousePosY = e.pageY - this.ctnPos.top;
        var deltaX = mousePosX - this.startX;
        var deltaY = mousePosY - this.startY;
        // console.log('rect W: %d ,H: %d', deltaX, deltaY);
        styleObj = {
            width: Math.abs(deltaX),
            height: Math.abs(deltaY),
        };
        // 右下向左上划时...
        if(deltaX < 0){
            styleObj.left = mousePosX
        }
        else{
            styleObj.left = this.startX
        }
        if(deltaY < 0){
            styleObj.top = mousePosY
        }
        else{
            styleObj.top = this.startY
        }
        // 直接赋值css会有bug jquery的bug
        // for(var i in styleObj){
        //     this.rectEle.css(i, styleObj[i]);
        // }
        this.rectEle.css( styleObj );
        if(callback instanceof Function){
            callback(styleObj);
        }
    }
    function endRect(e){
        this.doneRect();
    }
})()