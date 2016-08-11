//浏览器检测
(function () {
	window.sys = {};											//让外部可以访问，保存浏览器信息对象
	var ua = navigator.userAgent.toLowerCase();	//获取浏览器信息字符串
	var s;	//浏览器信息数组，浏览器名称+版本
	//测试IE浏览器
	if(typeof ActiveXObject && (/rv\:([\d.]+)/).test(ua)){
		s = ua.match(/rv\:([\d.]+)/) ;
		var str = s[0].replace('rv','msie');
		s[0] = str;
		sys.ie = s[1];
	}
	
	//火狐浏览器
	if ((/firefox\/([\d.]+)/).test(ua)) {
		s = ua.match(/firefox\/([\d.]+)/);
		sys.firefox = s[1];
	}
	//谷歌浏览器
	if ((/chrome\/([\d.]+)/).test(ua)) {
		s = ua.match(/chrome\/([\d.]+)/);
		sys.chrome = s[1];
	}
	//opera浏览器
	if ((/opera\/.*version\/([\d.]+)/).test(ua)) {
		s = ua.match(/opera\/.*version\/([\d.]+)/);
		sys.opera = s[1];
	}
	//safari浏览器
	if ((/version\/([\d.]+).*safari/).test(ua)) {
		s = ua.match(/version\/([\d.]+).*safari/);
		sys.safari = s[1];
	}
	
	if(/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//DOM加载
function addDomLoaded(fn) {
	var isReady = false;
	var timer = null;
	function doReady() {
		if (timer) clearInterval(timer);
		if (isReady) return;
		isReady = true;
		fn();
	}
	
	if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
		//无论采用哪种，基本上用不着了
		/*timer = setInterval(function () {
			if (/loaded|complete/.test(document.readyState)) { 	//loaded是部分加载，有可能只是DOM加载完毕，complete是完全加载，类似于onload
				doReady();
			}
		}, 1);
		*/

		timer = setInterval(function () {
			if (document && document.getElementById && document.getElementsByTagName && document.body) {
				doReady();
			}
		}, 1);
	} else if (document.addEventListener) {//W3C
		addEvent(document, 'DOMContentLoaded', function () {
			fn();
			removeEvent(document, 'DOMContentLoaded', arguments.callee);
		});
	} else if (sys.ie && sys.ie < 9){
		var timer = null;
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left');
				doReady();
			} catch (e) {};
		}, 1);
	}
}

//获得浏览器屏幕大小
function getInner() {
	if (typeof window.innerWidth != 'undefined') {
		return {
			width : window.innerWidth,
			height : window.innerHeight
		}
	} else {
		return {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		}
	}
}

//跨浏览器获取滚动条位置
function getScroll(){
	return {
		top:document.documentElement.scrollTop || document.body.scrollTop ,
		left:document.documentElement.scrollLeft || document.body.scrollLeft 
	}
}
//获取跨浏览器style、link 规则
function getStyle(element,attr){
	var value;
	if(typeof window.getComputedStyle != 'undefined'){//w3c
        value =  window.getComputedStyle(element,null)[attr];
    }else if(typeof element.currentStyle != 'undefined'){
        value = element.currentStyle[attr] ;
    }
    return value ;
}


//判断class是否存在
function hasClass(element,className){
	var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
    return element.className.match(reg);
}


//跨浏览器添加link规则
function insertRule(sheet,selectorText,cssText,position){
    if(typeof sheet.insertRule!='undefined'){
        sheet.insertRule(selectorText+"{"+cssText+"}",position);
    }else if(typeof sheet.addRule!='undefined'){
        sheet.addRule(selectorText,cssText,position);
    }
}


//移除跨浏览器link规则
function deleteRule(sheet,index){
	 if(typeof sheet.deleteRule!='undefined'){
        sheet.deleteRule(index);
    }else if(typeofsheet.removeRule){
        sheet.removeRule(index);
    }
}

//跨浏览器获取innerText
function getInnerText(element) {
	return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

//跨浏览器设置innerText
function setInnerText(element, text) {
	if (typeof element.textContent == 'string') {
		element.textContent = text;
	} else {
		element.innerText = text;
	}
}

//跨浏览器事件绑定
function addEvent(obj,type,fn){
	if( typeof obj.addEventListener != 'undefined'){
		obj.addEventListener(type,fn,false);
	}else {
		//创建一个存放事件的哈希表(散列表)
		if (!obj.events) obj.events = {};
		//第一次执行时执行
		if (!obj.events[type]) {	
			//创建一个存放事件处理函数的数组
			obj.events[type] = [];
			//把第一次的事件处理函数先储存到第一个位置上
			if (obj['on' + type]) obj.events[type][0] = fn;
		}else{
			if(addEvent.equal(obj.events[type],fn)) return false;
		}
		//从第二次开始我们用事件计数器来存储
		obj.events[type][addEvent.ID++] = fn;
		//执行事件处理函数
		obj['on' + type] = addEvent.exec;
	}
}
/*		
		//实现累加，并且清晰的指出是专给addEvent用的
		//JS一切皆为对象，所以addEvent.ID语法正确，实际上是个全局变量
		alert(addEvent.ID);
		addEvent.ID++;	
*/
//为每个事件分配一个计数器
addEvent.ID = 1;

//执行事件处理函数
addEvent.exec = function(event){
	var e = event || addEvent.fixEvent(window.event) ;
	var ethis = this.events[e.type] ;
	for (var i in ethis) {
		ethis.call(this,e);
	}
};

//同一个注册函数进行屏蔽
addEvent.equal = function(ethis,fn){
	for (var i in ethis) {
		if(ethis[i] == fn) return true;
	}
	return false;
};
//把IE常用的event对象配对到w3c中去  通用的w3c的阻止默认行为模式  preventDefaule();
addEvent.fixEvent = function(event){
	event.preventDefault =  addEvent.fixEvent.preventDefault ;
	event.stopPropagation =  addEvent.fixEvent.stopPropagation ;
	event.target = event.srcElement ;
	return event;
};

//IE取消默认行为
addEvent.fixEvent.preventDefault = function(){
	this.returnValue = false ;
};
//IE取消冒泡行为
addEvent.fixEvent.stopPropagation = function(){
	this.cancelBubble = true ;
};
//跨浏览器移除事件
function removeEvent(obj,type,fn){
	if( typeof obj.removeEventListener != 'undefined'){
		obj.removeEventListener(type,fn,false);
	}else{
		if(obj.events){
			for (var i in obj.events[type]) {
				if(obj.events[type][i] == fn){
					delete obj.evetns[type][i];
				}
		    }
		}	
	}
}

//去除空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}

//匹配数组中是否存在某个值
function inArray(array,value){
	for(var i in array){
		if(array[i] === value) return true ;
	}
	return false ;
}

//获取某一个节点的上一个节点的索引
function prevIndex(current,parent){
	var length = parent.children.length ;
	if(parseInt(current) == 0){
		return length -1 ;
	} 
	return parseInt(current) - 1;
}
//获取某一个节点的下一个节点的索引
function nextIndex(current,parent){
	var length = parent.children.length ;
	if(parseInt(current) == length - 1){
		return 0 ;
	} 
	return parseInt(current) + 1;
}
//获取某一节点到最顶端的距离
function offsetTop(element) {
	return element.offsetTop;
	/*
	 * var parent = element.offsetParent;
		while (parent !== null) {
		top += parent.offsetTop;
		parent = parent.offsetParent;
		}
	 */
}

//滚动条固定
function fixedScroll(){
	setTimeout(function(){
		window.scrollT(fixedScroll.left,fixedScroll.top);
	},100);	
}
//阻止默认行为
function predef(e) {
	e.preventDefault();
}

//创建cookie
function setCookie(name, value, expires, path, domain, secure) {
	var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	if (expires instanceof Date) {
		cookieText += '; expires=' + expires;
	}
	if (path) {
		cookieText += '; expires=' + expires;
	}
	if (domain) {
		cookieText += '; domain=' + domain;
	}
	if (secure) {
		cookieText += '; secure';
	}
	document.cookie = cookieText;
}

//获取cookie
function getCookie(name) {
	var cookieName = encodeURIComponent(name) + '=';
	var cookieStart = document.cookie.indexOf(cookieName);
	var cookieValue = null;
	if (cookieStart > -1) {
		var cookieEnd = document.cookie.indexOf(';', cookieStart);
		if (cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
	}
	return cookieValue;
}

//删除cookie
function unsetCookie(name) {
	document.cookie = name + "= ; expires=" + new Date(0);
}