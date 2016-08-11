/**
 * Created by jiajia on 2016/1/27.
 */
var $ = function(args){
    return new Base(args);
}

function Base(args){
    //创建一个数组，来保存获取的节点和节点数组
    this.elements = [];
     if( typeof args == 'string'){
    	if(args.indexOf(' ')!= -1 ){
    		//进行css模拟
    		var elements = args.split(' '); //用空格将其拆分成相应子串保存在数组中
    		var childElements = [] ;  //临时数组保存对象节点，避免后面的覆盖问题
    		var node = [] ; //用来存放父节点
    		for(var i =0;i<elements.length;i++){
    			if(node.length == 0) node.push(document);
		    	switch(elements[i].charAt(0)){
		    		//匹配id选择器
		    		case '#':
		    			childElements = [] ;  // 清理掉临时节点，以便父节点失效 ，子节点失效
		    			childElements.push(this.getId(elements[i].substring(1)));  
		    			node = childElements ;   //因为childElements要清理掉，所以使用node来保存
		    			break;
		    		//匹配class选择器
					case '.':
						childElements = [];
						for(var j=0;j<node.length;j++){
							var temps = this.getClass(elements[i].substring(1),node[j]); //因为可能存在多个值，保存到临时数组中					
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k])
							}
						}
						node = childElements ;
						break;
					//匹配标签名的选择器
					default:
						childElements = [];
						for(var j=0;j<node.length;j++){
							var temps = this.getTagName(elements[i],node[j]); //因为可能存在多个值，保存到临时数组中
							for(var k=0;k<temps.length;k++){
								childElements.push(temps[k])
							}
						}
						node = childElements ;						
		    	}
    		}
    		this.elements = childElements ;
    	}else{
    		//find 模拟
    		//获得字符串的第一个值进行匹配
    		switch(args.charAt(0)){
	    		//匹配id选择器
	    		case '#':
	    			this.elements.push(this.getId(args.substring(1)));
	    			break;
	    		//匹配class选择器
				case '.':
					this.elements = this.getClass(args.substring(1));
					break;
				//匹配标签名的选择器
				default:
					this.elements = this.getTagName(args);
    		}
    	}
    	
    }else if(typeof args == 'object'){
    	if (args != undefined) { //args是一个对象，undefined也是一个对象，区别与typeof返回的带单引号的'undefined'
        	this.elements[0] = args;
    	}
    }else if(typeof args == 'function'){
    	//结合ready函数可将addDomLoaded(args)变为
    	this.ready(args);
    }
}

//addDomloaded
Base.prototype.ready = function(fn){
	addDomLoaded(fn);
};
//获取id
Base.prototype.getId = function(id){
   return document.getElementById(id);
};

//获取元素节点数组
Base.prototype.getTagName = function(tag,parentNode){
	var node = null;
    var temps = [];//临时数组存放节点
    if(parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var tags = node.getElementsByTagName(tag);
    for(var i=0;i<tags.length;i++){
        temps.push(tags[i]);
    }
    return temps;
};

//获取名称节点数组
Base.prototype.getName = function(name){
    var names = document.getElementsByName(name);
    for(var i=0;i<names.length;i++){
        this.elements.push(names[i]);
    }
    return this;
};

//获取class节点数组
Base.prototype.getClass = function(className,parentNode){
    var node = null;
    var temps = [];//临时数组存放节点
    if(parentNode != undefined) {
        node = parentNode;
    } else {
        node = document;
    }
    var all = node.getElementsByTagName('*');
    for (var i = 0; i < all.length; i ++) {
        if ( (new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className) ) {
            temps.push(all[i]);
        }
    }
    return temps;
};

//获取某个节点 返回获取的节点
Base.prototype.getEle = function(num){
    return this.elements[num];
};

//获取首个节点并返回节点对象 是html的元素对象 是为了操作元素对象的某些属性和方法
Base.prototype.first = function(){
	return this.elements[0];
};

//获取末尾节点并返回节点对象
Base.prototype.last = function(){
	return this.elements[this.elements.length - 1];
};

//获取某组节点的数量
Base.prototype.length = function(){
	return this.elements.length ;
};
//获取某一节点对象的属性
Base.prototype.attr = function(attr,value){
	 for(var i=0;i<this.elements.length;i++){
        if(arguments.length == 1){
            return this.elements[i].getAttribute(attr);
        }else if(arguments.length == 2){
        	this.elements[i].setAttribute(attr,value);
        }  
    }
	return this;
};

//获取某一个节点在整个节点数组中是第几个的索引值
Base.prototype.index = function(){
	var children = this.elements[0].parentNode.children;
	for(var i = 0;i<children.length;i++){
		if(this.elements[0] == children[i]) return i;
	}
};
//设置某一个节点的透明度
Base.prototype.opacity = function(num){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.opacity = num / 100 ;
	}
	return this;
};
//获取某个节点 返回对象 是Base  是为了连缀
Base.prototype.eq = function(num){
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
    return this;
};

//获取当前节点的下一个元素节点
//当相同操作都是下一个元素节点获取，所以出现了next函数获取节点 来缩减代码量
Base.prototype.next = function(){
	for(var i=0;i<this.elements.length;i++){	
		this.elements[i] = this.elements[i].nextSibling ;
		if(this.elements[i] == null)  throw new Error("找不到下一个同级元素节点！");
		if(this.elements[i].nodeType == 3) this.next() ;
	}
	return this;
};
//获取当前节点的上一个元素节点
Base.prototype.prev = function(){
	for(var i=0;i<this.elements.length;i++){	
		this.elements[i] = this.elements[i].previousSibling ;
		if(this.elements[i] == null)  throw new Error("找不到上一个同级元素节点！");
		if(this.elements[i].nodeType == 3) this.prev() ;
	}
	return this;
};

//设置css选择器
Base.prototype.find = function(str){
	var childElements = [];
	for(var i=0;i<this.elements.length;i++){
    	//获得字符串的第一个值进行匹配
    	switch(str.charAt(0)){
    		//匹配id选择器
    		case '#':
    			childElements.push(this.getId(str.substring(1)));
    			break;
    		//匹配class选择器
			case '.':
			 	var temps = this.getClass(str.substring(1),this.elements[i]);
			 	for(var j=0;j<temps.length;j++){
			 		alert(temps[j]);
					childElements.push(temps[j]);
				}
				break;
			//匹配标签名的选择器
			default:
				var temps = this.getTagName(str,this.elements[i]);
				for(var j=0;j<temps.length;j++){
					childElements.push(temps[j]);
				}
    	}
	 }
	 this.elements = childElements ;
	 return this;
};

//添加class方法
Base.prototype.addClass = function(className){
    for(var i=0;i<this.elements.length;i++){
        //var reg = /(\s|^)\+className\+(\s|$)/;
        //var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
        if(!hasClass( this.elements[i],className)){
            this.elements[i].className += ' ' + className;
        }
    }
    return this;
};

//移出class方法
Base.prototype.removeClass = function(className){
    for(var i=0;i<this.elements.length;i++){
        //var reg = /'(\s|^)'+className+'(\s|$)'/;
        //var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
        if(hasClass(this.elements[i],className)){
            //this.elements[i].className = this.elements[i].className.replace(className,' ');
            this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');
        }
    }
    return this;
};

//设置link或style中的CSS规则
Base.prototype.addRule = function(num,selectorText,cssText,position){
    var sheet = document.styleSheets[num];
    insertRule(sheet,selectorText,cssText,position);
};

//移除link或style中的CSS规则
Base.prototype.removeRule = function(num,index){
    var sheet = document.styleSheets[num];
    deleteRule(sheet,index);
    return this;
};

//添加css方法
Base.prototype.css = function(attr,value){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length == 1){
            return getStyle(this.elements[i],attr) ;
        }
        this.elements[i].style[attr] = value;
    }
    return this;
};

//设置表单字段元素
Base.prototype.form = function(name){
	for(var i=0;i<this.elements.length;i++){
       this.elements[i] = this.elements[i][name];
    }
    return this;
};

//设置表单字段元素内容获取
Base.prototype.value = function(str){
	for(var i=0;i<this.elements.length;i++){
       if(arguments.length == 0){
            return this.elements[i].value;
        }
        this.elements[i].value = str;
    }
    return this;
};
//添加innerhtml方法
Base.prototype.html = function(str){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length == 0){
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;
};

//添加innerText方法
Base.prototype.text = function(text){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length == 0){
            return getInnerText(this.elements[i]);
        }
        setInnerText(this.elements[i],text) ;
    }
    return this;
};

//设置显示
Base.prototype.show = function(){
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].style.display = 'block';
    }
    return this;
};
//设置隐藏
Base.prototype.hide = function(){
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
};

//设置事件的发生器
Base.prototype.bind = function(event,fn){
	for (var i = 0; i < this.elements.length; i++) {
		addEvent(this.elements[i],event,fn);
	}
	return this ;
};
	
//设置鼠标移入移出
Base.prototype.hover = function (over, out) {
    for (var i = 0; i < this.elements.length; i++) {
    	/*
    	 * 将传统的事件绑定改为现代事件绑定
    	 *  this.elements[i].onmouseover = over;
           this.elements[i].onmouseout = out;
    	 */
    	addEvent(this.elements[i],'mouseover',over);
    	addEvent(this.elements[i],'mouseout',out);
       
    }
    return this;
};

//设置点击切换方法
Base.prototype.toggle = function(){
	for (var i = 0; i < this.elements.length; i++) {
		//为了防止出现 公用计数器，所以用独立函数分配出去，每次调用都是独立的计数器  采用闭包格式合并tog函数
		//tog(this.elements[i],arguments);
		(function(element,args){
			var count = 0 ;
			addEvent(element,'click',function(){
				args[count++ % args.length ].call(this);//采用call调用this，是为了当多个操作相同时，来识别点击的对象是什么
			});
		})(this.elements[i],arguments);
	}
	/*
	function tog(element,args){
	因为是切换执行,所以采用一个计数器
	var count = 0 ;
	addEvent(element,'click',function(){
		args[count++ % args.length ].call(this); 
		 为了循环切换，进行判断切换个数重新给count赋值 
		 可采用求余数进行赋值运行
		if(count >= args.length) count = 0;
	});
	*/
	return this;
};


//添加click方法
Base.prototype.click = function(fn){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].onclick = fn;
    }
    return this;
};

//设置物体居中
Base.prototype.center = function(width,height){
	var left = ( getInner().width - width) / 2 + getScroll().left;
	var top = (getInner().height - height) / 2 + getScroll().top;
	for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.top = top + 'px';
        this.elements[i].style.left = left + 'px';
    }
	return this;
};

//触发浏览器窗口改变事件
Base.prototype.resize = function(fn){
	for (var i = 0; i < this.elements.length; i++) {
		var element = this.elements[i];
		addEvent(window,'resize',function(){
			fn();
			//确保在浏览器缩放时，弹出的登录框能按原位置显示
			if (element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth) {
				element.style.left = getInner().width + getScroll().left - element.offsetWidth + 'px';
				if(element.offsetLeft <= 0 + getScroll().left ){
					element.style.offsetLeft = 0 + getScroll().left + 'px';
				}
			}
			if (element.offsetTop > getInner().height + getScroll().top - element.offsetHeight) {
				element.style.top = getInner().height + getScroll().top - element.offsetHeight + 'px';
				if(element.offsetTop <= 0 + getScroll().top ){
					element.style.offsetTop = 0 + getScroll().top + 'px';
				}
			}
		});
	}
	return this;
};

//锁屏
Base.prototype.lock = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		fixedScroll.top = getScroll().top ;
		fixedScroll.left = getScroll().left ;
		this.elements[i].style.width = getInner().width + getScroll().left + 'px';
		this.elements[i].style.height = getInner().height + getScroll().top + 'px';
		this.elements[i].style.display = 'block';
		parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'hidden' : document.documentElement.style.overflow = 'hidden';
		addEvent(this.elements[i], 'mousedown', predef);
		addEvent(this.elements[i], 'mouseup', predef);
		addEvent(this.elements[i], 'selectstart', predef);
		addEvent(window, 'scroll',fixedScroll);
	}
	return this;
};
Base.prototype.unlock = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'none';
		parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'auto' : document.documentElement.style.overflow = 'auto';
		removeEvent(this.elements[i], 'mousedown', predef);
		removeEvent(this.elements[i], 'mouseup', predef);
		removeEvent(this.elements[i], 'selectstart', predef);
		removeEvent(window, 'scroll',fixedScroll);
	}
	return this;
};

//设置动画 缓冲 渐变 
Base.prototype.animate = function (obj) {
	// obj可传 attr属性 start起始点 t间隔时间 step每次的像素值 alter移动的增量  
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		//可选，left、top、宽度width 高度height 透明度 o 五种变换，不传递则默认left
		var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : 
			obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' :
			obj['attr'] == 'o' ? 'opacity' :obj['attr'] != undefined ? obj['attr'] : 'left';	
		//在非渐变时是本身属性设置的值，当设置的属性是opacity时，其值是css中设置的透明度的值
		var start = obj['start'] != undefined ? obj['start'] :
					attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 :
					parseInt(getStyle(element, attr));	
		
		var t = obj['t'] != undefined ? obj['t'] : 10;	//可选，默认30毫秒执行一次
		
		var step = obj['step'] != undefined ? obj['step'] : 10;	//可选，每次运行10像素
		
		var alter = obj['alter'];      //增量设置
		var target = obj['target'];    //目标值设置
		var mul = obj['mul'] ;  //同步动画的对象值必须是属性 ： 目标值  的键值对
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;		//可选，默认缓冲速度为6
		
		//可选，0表示匀速，1表示缓冲，默认缓冲
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';
		
		if (alter != undefined && target == undefined) {
			target = alter + start;
		} else if (alter == undefined && target == undefined && mul == undefined) {
			throw new Error('alter增量、target目标量或同步动画的mul值必须传一个！');
		}
		
		//判断是右、下运动 step值为正   还是左上运动step值为负数
		if (start > target) step = -step;
		
		if(attr == 'opacity'){
			element.style.opacity = parseInt(start) / 100 ;
		}else{
			element.style[attr] = start + 'px';
		}
		 //如果不是多个动画执行，则for循坏里就不会执行，所以采用创建mul对象使其进入for循坏
		if(mul == undefined){
			mul = {};
			mul[attr] = target ;
		}
		clearInterval(element.timer);
		
		//定时器循环一次，执行一组值和一个for循环
		//for循环一次，执行一个值
		element.timer = setInterval(function () {
             //缓冲运动，因为透明度设置是小数，所以在赋值值将其转换比较方便
             //定时器中执行部分同时执行多次就变成同步执行动画
             /*
				问题1：多个动画执行了多个列队动画，我们要求不管多少个动画只执行一个列队动画
				问题2：多个动画数值差别太大，导致动画无法执行到目标值，原因是定时器提前清理掉了
				解决1：不管多少个动画，只提供一次列队动画的机会
				解决2：多个动画按最后一个分动画执行完毕后再清理即可
			*/
			//创建一个布尔值，这个值可以了解多个动画是否全部执行完毕
			var flag = true; //表示都执行完毕了
			
             //mul是一个数组对象，所以可遍历
			for(var i in mul){
				attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' :
						i == 'o' ? 'opacity' : i != undefined ? i : 'left'; 
				target = mul[i];
				if (type == 'buffer') {
					step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed :
								(target - parseInt(getStyle(element, attr))) / speed;
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}
				
				if(attr == 'opacity'){
					if (step == 0) {
						setOpacity();
					} else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
						setOpacity();
					} else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
						setOpacity();
					} else {
						var temp = parseFloat(getStyle(element, attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						//element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
					}
					if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;
				}else{
					if (step == 0) {
						setTarget();
					} else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
						setTarget();
					} else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
						setTarget();
					} else {
						element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
					}
					//当没有所有动画没有全部执行完，则继续执行不清除定时器
					if (parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
				}
			}
			if (flag) {
				clearInterval(element.timer);
				if(obj.fn != undefined)  obj.fn();  //为了实现列队动画,就是在动画中进行嵌套动画
			}
		}, t);
		function setTarget() {
			element.style[attr] = target + 'px';
		}
		//透明度设置
		function setOpacity() {
			element.style.opacity = parseInt(target) / 100;
			//element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
		}
	}
	return this;
};
//插件入口  参数表示可传不同的插件代码和名称
Base.prototype.extend = function(name,fn){
	//拖拽的插件入口
	Base.prototype[name] = fn ;
};
