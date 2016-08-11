//采用extend入口加载拖拽插件
$().extend('drag',function(){
	var tags = arguments; //对于可拖拽的目标进行传参保存目标
	for (var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i],'mousedown',function(event){
			if (trim(this.innerHTML).length == 0){
				event.preventDefault();
		    }
			// var event = getEvent(e);
			var _this = this;
			var diffX = event.clientX  - _this.offsetLeft ;
			var diffY = event.clientY  - _this.offsetTop ;
			//自定义拖拽区域
			var flag = false ;
			
			for(var i=0;i<tags.length;i++){
				if(event.target == tags[i]){  //只要点击的是可拖拽区域目标，就立刻执行拖拽，只要有一个目标符合条件就好
					flag = true ;   //只要有一个是true，就立刻返回
					break ;
				}
			}
			//鼠标只在登录框中课拖拽区域才可以拖动
			if(flag){
				addEvent(document,'mousemove',move);
			    addEvent(document,'mouseup',up);
			}else{//匿名函数是无法删除的，所以将其拿出重新定义函数 move up
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}
			
			function move(event){
				console.log("mo9ve");
				//var event = getEvent(e);
				//使拖拽不能超出浏览器的边框
				var left = event.clientX - diffX ;
				var top  = event.clientY - diffY ;
				if(left < 0){
					left = 0 ;
				}else if (left <= getScroll().left) {
					left = getScroll().left;
				}else if(left > getInner().width + getScroll().left - _this.offsetWidth){
					left = getInner().width + getScroll().left - _this.offsetWidth ;
				}
				if(top < 0){
					top = 0;
				}else if (top <= getScroll().top) {
					top = getScroll().top;
				}else if( top > getInner().height + getScroll().top - _this.offsetHeight){
					top = getInner().height + getScroll().top - _this.offsetHeight ;
				}
				_this.style.left = left + 'px' ;
				_this.style.top = top  + 'px';	
				
				if (typeof _this.setCapture != 'undefined') {
					_this.setCapture();
				} 
				
			}
			function up(){
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
				if (typeof _this.releaseCapture != 'undefined') {
					_this.releaseCapture();
				}
			}
		});
    }
	return this;
});