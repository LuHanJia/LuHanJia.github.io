/**
 * Created by jiajia on 2016/1/27.
 */
$(function(){
	//个人中心
	$('#header .member').hover(function(){
		$(this).css("background","url('img/arrow2.png') no-repeat 55px center");
		$('#header .member_ul').show().animate({
			t:30,
			step:10,
			mul:{
				o:100,
				h:120
			}
		});
	},function(){
		$(this).css("background","url('img/arrow.png') no-repeat 55px center");
	 	$('#header .member_ul').animate({
			t:30,
			step:10,
			mul:{
				o:0,
				h:0
			},
			fn:function(){
				$('#header .member_ul').hide();
			}
		});
	});
	
	//遮罩的画布
	var screen = $('#screen');
	
	//登录框	 
	//居中，当屏幕大小改变时仍然居中
	var login = $('#login');   //简化代码
	login.center(350,250);
	//屏幕大小改变
	login.resize(function(){
		if(login.css('display') == 'block'){
			screen.lock();
		}
	});
	//点击登录弹出对话框
	$('#header .login').click(function(){
		login.center(350,250);
		login.css('display','block');
		//当点击登录时设置锁屏
		screen.lock().animate({
			'attr':'o',
			'target':30,
			't':50,
			'step':10
		});
	});
	//点击关闭按钮关闭登录框
	$('#login .close').click(function(){
		login.css('display','none');
			//当点击关闭同时关闭锁屏
		screen.animate({
			'attr':'o',
			'target':0,
			't':50,
			'step':10,
			fn:function(){
				screen.unlock();  //动画执行完毕执行解锁罩
			}
		});
	});
	
	//注册框
	var reg = $('#reg');   //简化代码
	reg.center(600,550);
	//屏幕大小改变
	reg.resize(function(){
		if(reg.css('display') == 'block'){
			screen.lock();
		}
	});
	//点击登录弹出注册框
	$('#header .reg').click(function(){
		reg.center(600,550);
		reg.css('display','block');
		//当点击登录时设置锁屏
		screen.lock().animate({
			'attr':'o',
			'target':30,
			't':50,
			'step':10
		});
	});
	//点击关闭按钮关闭注册框
	$('#reg .close').click(function(){
		reg.css('display','none');
			//当点击关闭同时关闭锁屏
		screen.animate({
			'attr':'o',
			'target':0,
			't':50,
			'step':10,
			fn:function(){
				screen.unlock();  //动画执行完毕执行解锁罩
			}
		});
	});
	
	//拖拽插件入口
	//登录框拖动
	login.drag( $('#login h2').first() );
	//注册框拖动
	reg.drag( $('#reg h2').first() );
	//分享栏初始化位置
	$("#share").css('top',getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(),'height')))/2 + 'px');
	
	//添加滚动条事件，使分享一直在屏幕的相对原位置
	$(window).bind('scroll',function(){
		setTimeout(function(){
			$("#share").animate({
				attr:'y',
				target:getScroll().top + (getInner().height - parseInt(getStyle($('#share').first(),'height')))/2
			});
		},100);
	});
	
	//分享栏收缩效果
	$('#share').hover(function(){
		$(this).animate({
			'attr':'x',
			'target':0
		});
	},function(){
		$(this).animate({
			'attr':'x',
			'target':-211
		});
	});
	
	//滑动导航
	$('#nav .about li').hover(function(){
		var target = $(this).first().offsetLeft;
		$('#nav .nav_bg').animate({
			attr:'x',
			target: target + 20 ,
			t:30,
			step:10,
			fn:function(){
				$('#nav .white').animate({
					attr:'x',
					target: -target
				});
			}
		});
	},function(){
		$('#nav .nav_bg').animate({
			attr:'x',
			target: 20 ,
			t:30,
			step:10,
			fn:function(){
				$('#nav .white').animate({
					attr:'x',
					target: 0
				});
			}
	   });
	
    });
	
	//左侧菜单栏
	$('#sidebar h2').toggle(function(){
		$(this).next().animate({
			mul:{
				o:0,
				h:0
			}
		});
	},function(){
		$(this).next().animate({
			mul:{
				o:100,
				h:150
			}
		});
	});
	
	//在刷新时表单进行重新初始化
	$('form').eq(0).first().reset();
	//表单用户账号验证
	$('form').eq(0).form('user').bind('focus',function(){
		$('#reg .info_user').css('zIndex','2').css('display','block');
		$('#reg .error_user').css('display','none');
		$('#reg .succ_user').css('display','none');
	}).bind('blur',function(){
		if( (trim($(this).value()) ==  '')){
			$('#reg .info_user').css('display','none');
			$('#reg .error_user').css('zIndex','3').css('display','block');
			$('#reg .succ_user').css('display','none');
		}else if( (!check_user()) ){
			$('#reg .info_user').css('display','none');
			$('#reg .error_user').css('zIndex','3').css('display','block');
			$('#reg .succ_user').css('display','none');
		}else{
			$('#reg .info_user').css('display','none');
			$('#reg .error_user').css('display','none');
			$('#reg .succ_user').css('zIndex','3').css('display','block');
		}
	});
	
	//用户验证函数
	function check_user(){
		var flag = true ;
		if( !/[\w]{2,20}/.test(trim($('form').eq(0).form('user').value())) ){
			$('#reg .error_user').html("输入不合法，请重新输入!");
			return false;
		}else{
			$('#reg .loading').css('display','block');
			$('#reg .info_user').css('display','none');
			ajax({
				method : 'post',
				url : 'is_user.php',
				data : $('form').eq(0).serialize(),
				success : function (text) {
					if (text == 1) {
						$('#reg .error_user').html("用户名已存在!");
						flag = false ;
					}else{
						flag = true ;
					}
					$('#reg .loading').css('display','none');
				},
				async : false
			});
            return flag;
	    }
    }
	
	//表单密码验证
	$('form').eq(0).form('pass').bind('focus',function(){
		$('#reg .info_pass').css('zIndex','2');
		$('#reg .info_pass').css('display','block');
		$('#reg .error_pass').css('display','none');
		$('#reg .succ_pass').css('display','none');
	}).bind('blur',function(){
		$('#reg .info_pass').css('zIndex','1');
		if( (trim($(this).value()) ==  '') ) {
			$('#reg .info_pass').css('display','block');
			$('#reg .error_pass').css('display','block');
			$('#reg .succ_pass').css('display','none');
		}else{
			if( check_pass() ){
				$('#reg .info_pass').css('display','none');
				$('#reg .error_pass').css('display','none');
				$('#reg .succ_pass').css('display','block');
			}else{
				$('#reg .info_pass').css('display','none');
				$('#reg .error_pass').css('display','block');
				$('#reg .succ_pass').css('display','none');
			}
		}
	});
	
	//密码强度验证 当手指离开键盘时触发强度验证
	$('form').eq(0).form('pass').bind('keyup',function(){
		check_pass();
	});
	//检验密码的函数
	function check_pass(){
		//得到字符和其总长度
		var value =  trim( $('form').eq(0).form('pass').value() );
		var value_length = value.length;
		var code_length = 0 ;
		//第一个长度验证
		if(value_length >= 6 && value_length <= 20){
			$('#reg .info_pass .q1').html('●').css('color','green');
		}else{
			$('#reg .info_pass .q1').html('●').css('color','red');
		}
		//大小写字母 数字 非空字符验证
		if(value_length > 0 && !/\s/.test(value)){
			$('#reg .info_pass .q2').html('●').css('color','green');
		}else{
			$('#reg .info_pass .q2').html('●').css('color','red');
		}
		//大小写字母 数字 非空字符  混合密码 若匹配测试value含有其中一种  则将code_lenght 自动加 1
		if (/[\d]/.test(value)) {
			code_length++;
		}
		if (/[a-z]/.test(value)) {
			code_length++;
		}
		if (/[A-Z]/.test(value)) {
			code_length++;
		}
		if (/[^\w]/.test(value)) {
			code_length++;
		}
		if(code_length >= 2){
			$('#reg .info_pass .q3').html('●').css('color','green');
		}else{
			$('#reg .info_pass .q3').html('●').css('color','red');
		}
		/*
		  安全级别判定:  等先判断高级别  从高---低进行判断 防止高级别无法执行
		  高：长度大于等于10   混合3种
		  中：长度大于等于8     混合两种
		  低： 长度大于等于6  一种
		 */
		if(value_length >= 10 && code_length >= 3){
			$('#reg .info_pass .s1').css('color','green');
			$('#reg .info_pass .s2').css('color','green');
			$('#reg .info_pass .s3').css('color','green');
			$('#reg .info_pass .s4').html('高').css('color','green');
		}else if(value_length >= 8 && code_length >= 2){
			$('#reg .info_pass .s1').css('color','#f60');
			$('#reg .info_pass .s2').css('color','#f60');
			$('#reg .info_pass .s3').css('color','#ccc');
			$('#reg .info_pass .s4').html('中').css('color','#f60');
		}else if(value_length >= 1){
			$('#reg .info_pass .s1').css('color','maroon');
			$('#reg .info_pass .s2').css('color','#ccc');
			$('#reg .info_pass .s3').css('color','#ccc');
			$('#reg .info_pass .s4').html('低').css('color','maroon');
		}else{
			$('#reg .info_pass .s1').css('color','#ccc');
			$('#reg .info_pass .s2').css('color','#ccc');
			$('#reg .info_pass .s3').css('color','#ccc');
			$('#reg .info_pass .s4').html(' ').css('color','#ccc');
		}
		if ( value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_length >= 2) {
			return true;
		}else{
			return false;
		}
		
	}
	
	//密码确认
	$('form').eq(0).form('notpass').bind('focus',function(){
		$('#reg .info_notpass').css('zIndex','2');
		$('#reg .info_notpass').css('display','block');
		$('#reg .error_notpass').css('display','none');
		$('#reg .succ_notpass').css('display','none');
	}).bind('blur',function(){
		$('#reg .info_notpass').css('zIndex','1');
		if( trim($(this).value()) ==  '' ) {
			$('#reg .info_notpass').css('display','block');
			$('#reg .error_notpass').css('display','block');
			$('#reg .succ_notpass').css('display','none');
		}else if( check_notpass() ){
			$('#reg .info_notpass').css('display','none');
			$('#reg .error_notpass').css('display','none');
			$('#reg .succ_notpass').css('display','block');
		}else{
			$('#reg .info_notpass').css('display','none');
			$('#reg .error_notpass').css('display','block');
			$('#reg .succ_notpass').css('display','none');
		}
	});
	function check_notpass(){
		if( trim($('form').eq(0).form('notpass').value()) == trim( $('form').eq(0).form('pass').value() ) ) {
			return true;
		}
	}
	
	//检测是否选择了提问
	$('form').eq(0).form('ques').bind('change', function () {
		if (check_ques()){
			$('#reg .error_que').hide();
		}else{
			$('#reg .error_que').show();
		}
	});
	
	function check_ques() {
		if ($('form').eq(0).form('ques').value() != 0) return true;
	}
	
	//回答
	$('form').eq(0).form('ans').bind('focus',function(){
		if( $('form').eq(0).form('ques').value() == 0 ){
			$('#reg .error_que').show();
		}
		$('#reg .info_ans').css('display','block');
		$('#reg .error_ans').css('display','none');
		$('#reg .succ_ans').css('display','none');
	}).bind('blur',function(){
		if( trim($(this).value()) ==  '' ) {
			$('#reg .info_ans').css('display','block');
		}else if( check_ans() ){
			$('#reg .info_ans').css('display','none');
			$('#reg .error_ans').css('display','none');
			$('#reg .succ_ans').css('display','block');
		}else{
			$('#reg .info_ans').css('display','none');
			$('#reg .error_ans').css('display','block');
			$('#reg .succ_ans').css('display','none');
		}
	});
	//检测回答
	function check_ans(){
		if(trim($('form').eq(0).form('ans').value()).length >=2 && trim($('form').eq(0).form('ans').value()).length <=32 ){
			return true;
		}
	}
	
	//电子邮件确认
	$('form').eq(0).form('email').bind('focus',function(){
		//补全界面
		//当邮件输入没有@符号时进行自动补全
		if($(this).value().indexOf('@') == -1){
			$('#reg .all_email').css('display','block');
		}
		$('#reg .info_email').css('display','block');
		$('#reg .error_email').css('display','none');
		$('#reg .succ_email').css('display','none');
	}).bind('blur',function(){
		$('#reg .all_email').css('display','none');
		affirm_email();
	});
	function affirm_email(){
		if( trim($('form').eq(0).form('email').value()) ==  '' ) {
			$('#reg .info_email').css('display','block');
			//邮件名： a-zA-Z0-9_-. 域名：a-zA-Z0-9_-  
			//域名后缀： .com .net .cn .asia .mobi  .com.cn  a-zA-Z
		}else if( check_email() ){
			$('#reg .info_email').css('display','none');
			$('#reg .error_email').css('display','none');
			$('#reg .succ_email').css('display','block');
		}else{
			$('#reg .info_email').css('display','none');
			$('#reg .error_email').css('display','block');
			$('#reg .succ_email').css('display','none');
		}
	}
	//检测邮件
	function check_email(){
		if( /^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($('form').eq(0).form('email').value())) ){
			return true;
		}
	}
	
	//电子邮件补全系统键入
	$('form').eq(0).form('email').bind('keyup',function(event){
		var value = $(this).value();
		if(value.indexOf('@') == -1){
			//实时跟进检测是否存在@符号 然后进行补全
			$('#reg .all_email').css('display','block');
			$('#reg .all_email li span').html(value);
		}else{
			//当存在@符号时 则不再使用自动补全功能
			$('#reg .all_email').css('display','none');
		}
		$('#reg .all_email li').css('background','none');
		$('#reg .all_email li').css('color','#666');
		//通过键盘的上下键和enter键完成补全 上 38 下40 enter13
		//var length = $('#reg .all_email li').length()  ; //统计补全系统中邮箱个数
		if(event.keyCode == 40){
			if(this.index == undefined || this.index >= $('#reg .all_email li').length()-1){
				this.index = 0;  //设置补全系统中每个邮箱的索引值 ，以便当键盘选中时进行识别标记
			}
			else{
				this.index++ ; //从上往下就是index值自加1
			}
			$('#reg .all_email li').eq(this.index).css('background','#e5edf2');
			$('#reg .all_email li').eq(this.index).css('color','#369');
		}
		if(event.keyCode == 38){
			if(this.index == undefined || this.index <= 0){
				this.index = $('#reg .all_email li').length()-1 ;  
			}
			else{
				this.index-- ;  //从下往上是index 值自减1
			}
			$('#reg .all_email li').eq(this.index).css('background','#e5edf2');
			$('#reg .all_email li').eq(this.index).css('color','#369');
		}
		if(event.keyCode == 13){
			$(this).value($('#reg .all_email li').eq(this.index).text());
			$('#reg .all_email').css('display','none');
			this.index = undefined ; //为了下次输入时 使用键盘选择仍是从第一个开始
		}
		
	});
	//电子邮件系统点击获取 采用鼠标进行键入
	//PS:click事件是点击弹起后触发，而此事件发生在blur失去焦点后，所以导致没有可点击的元素，所以无法触发
	//所以采用点下去就就触发事件
	$('#reg .all_email li').bind('mousedown',function(){
		$('form').eq(0).form('email').value($(this).text());
		affirm_email();
	});
	
	//电子邮件补全系统鼠标移入移除效果
	$('#reg .all_email li').hover(function(){
		$(this).css('background','#e5edf2');
		$(this).css('color','#369');
	},function(){
		$(this).css('background','none');
		$(this).css('color','#666');
		
	});
	
	//生日 年月日
	var year = $('form').eq(0).form('year');
	var month = $('form').eq(0).form('month');
	var day = $('form').eq(0).form('day');
	var day30 = [4,6,9,11] ;
	var day31 = [1,3,5,7,8,10,12] ;
	//注入年份
	for(var i = 1960;i<=2016;i++){
		// 增加一个<option>标签-----obj.options.add(new("文本","值"));
		//在<select>标签中创建一个或多个<option value="值">文本</option> 
		year.first().add(new Option(i,i),undefined);
	}
	for(var i = 1;i<=12;i++){
		month.first().add(new Option(i,i),undefined);
	}
	//当年份选择改变时 注入天数
	year.bind('change',select_day);
	//当月份改变选择时 注入天数
	month.bind('change',select_day);
	
	day.bind('change', function () {
		if (check_birthday()) $('#reg .error_birthday').hide();
	});
	//检测日期
	function check_birthday(){
		if(year.value()!=0 && month.value != 0 && day.value() != 0){
			return true ;
		}
	}
	//选择天数
	function select_day(){
		if(year.value() != 0  && month.value() != 0){
			//在注入天数之前进行清理天数
			day.first().options.length = 1;
			//注入日期
			var cur_day = 0 ;//不确定天数
			if( inArray( day31 , parseInt( month.value()) ) ){
				cur_day = 31 ;	
			}else if( inArray( day30 , parseInt(month.value()) ) ){
				cur_day = 30 ;
			}else{
				var year_value = parseInt( year.value() ) ;
				if( ( year_value % 4 == 0  && year_value % 100 != 0 ) || year_value % 400 == 0 ){
					cur_day = 29 ;
				}else{
					cur_day = 28 ;
				}		
			}
			for(var j=1;j<=cur_day;j++){
				day.first().add( new Option(j,j) , undefined );
			}
		}else{
				day.first().options.length = 1;
		}
	}
	
	//表单备注
	var num_length = $('#reg .ps .num').eq(0).html() ;
	$('form').eq(0).form('ps').bind('keyup',check_ps).bind('paste',function(){
		//粘贴事件会在内容粘贴到文本框之前触发，所以将其延迟，否则无法检测备注字数
		setTimeout(check_ps,50);
	});
	//清尾
	$('#reg .ps .clear').click(function(){
		$('form').eq(0).form('ps').value( $('form').eq(0).form('ps').value().substring(0,num_length) ) ;
		check_ps() ;
	});
	//备注字数检测
	function check_ps(){
		var num = num_length - $('form').eq(0).form('ps').value().length; //得到还可以输入的字符数
		if(num >= 0){
			$('#reg .ps').eq(0).css('display','block');
			$('#reg .ps .num').eq(0).html(num);
			$('#reg .ps').eq(1).css('display','none');
			return true;
		}else{
			$('#reg .ps').eq(0).css('display','none');
			$('#reg .ps').eq(1).css('display','block');
			$('#reg .ps .num').eq(1).html(Math.abs(num)).css('color','red');	
			return false;
		}
	}
	
	//提交
	$('form').eq(0).form('sub').click(function(){
		var flag = true;
		 if(!check_user()){
		 	flag = false ;
		 	$('#reg .error_user').css('zIndex','3').css('display','block');
		 }
		 if(!check_pass()){
		 	flag = false ;
		 	$('#reg .error_pass').css('display','block');
		 }
		 if(!check_notpass()){
		 	flag = false ;
		 	$('#reg .error_notpass').css('display','block') ;
		 }
		 if( !check_ques() ){
		 	flag = false ;
		 	$('#reg .error_que').css('display','block') ;
		 }
		 if( !check_ans()){
		 	flag = false ;
		 	$('#reg .error_ans').css('display','block') ;	
		 }
		 if( !check_email() ){
		 	flag = false ;
		 	$('#reg .error_email').css('display','block') ;	
		 }
		 if( !check_birthday()){
		 	flag = false;
			$('#reg .error_birthday').show();
		 }
		 if( !check_ps()){
		 	flag = false ;
		 	$('#reg .clear').html('必须清尾').css('color','red');
		 }
		if(flag){
			var _this = this;
			$('#loading').show().center(200, 40);
			$('#loading p').html('正在提交注册中...');
			_this.disabled = true;
			$(_this).css('backgroundPosition', 'right');
			ajax({
				method : 'post',
				url : 'add.php',
				data : $('form').eq(0).serialize(),
				success : function (text) {
					if (text == 1) {
						$('#loading').hide();
						$('#success').show().center(200, 40);
						$('#success p').html('注册成功，请登录...');
						setTimeout(function () {
							$('#success').hide();
							reg.hide();
							$('#reg .succ').hide();
							$('form').eq(0).first().reset();
							_this.disabled = false;
							$(_this).css('backgroundPosition', 'left');
							screen.animate({
								attr : 'o',
								target : 0,
								t : 30,
								step : 10,
								fn : function () {
									screen.unlock();
								}
							});
						}, 1500);
					}
				},
				async : true
			});
		}
	
	});
	
	//用户登录判断
	$('form').eq(1).form('sub').click(function () {
		if (/[\w]{2,20}/.test(trim($('form').eq(1).form('user').value())) && $('form').eq(1).form('pass').value().length >= 6) {
			var _this = this;
			$('#loading').show().center(200, 40);
			$('#loading p').html('正在尝试登录...');
			_this.disabled = true;
			$(_this).css('backgroundPosition', 'right');
			ajax({
				method : 'post',
				url : 'is_login.php',
				data : $('form').eq(1).serialize(),
				success : function (text) {
					$('#loading').hide();
					if (text == 1) {	  //失败
						$('#login .info').html('登录失败：用户名或密码不正确！');
					} else {  //成功
						$('#login .info').html('');
						$('#success').show().center(200, 40);
						$('#success p').html('登录成功，请稍后...');
						setCookie('user', trim($('form').eq(1).form('user').value()));
						setTimeout(function () {
							$('#success').hide();
							login.hide();
							$('form').eq(1).first().reset();
							screen.animate({
								attr : 'o',
								target : 0,
								t : 30,
								step : 10,
								fn : function () {
									screen.unlock();
								}
							});
							$('#header .reg').hide();
							$('#header .login').hide();
							$('#header .info').show().html(getCookie('user') + '，您好！');
						}, 1500);
					}
					_this.disabled = false;
					$(_this).css('backgroundPosition', 'left');
				},
				async : true
			});
		} else {
			$('#login .info').html('登录失败：用户名或密码不合法！');
		}
	});

	//轮播器初始化
	$('#banner img').opacity(0);
	$('#banner img').eq(0).opacity(100);
	$('#banner ul li').eq(0).css('color','#333');
	$('#banner strong').html($('#banner img').eq(0).attr('alt'));
	
	//轮播计数器
	var banner_index = 1 ;//因为默认是0 第一张照片
	//轮播器的种类
	var banner_type = 1 ;// 1是透明度 2是上下滚动
	//自动轮播器
	var banner_timer = setInterval(banner_fn,2000);
	
	function banner(obj, prev) {
		$('#banner ul li').css('color', '#999');
		$(obj).css('color', '#333');
		$('#banner strong').html($('#banner img').eq($(obj).index()).attr('alt'));
		if (banner_type == 1) {
			$('#banner img').eq(prev).animate({
				attr : 'o',
				target : 0,
				t : 30,
				step : 10
			}).css('zIndex', 1);
			$('#banner img').eq($(obj).index()).animate({
				attr : 'o',
				target : 100,
				t : 30,
				step : 10
			}).css('zIndex', 2);
		} else if (banner_type == 2) {
			$('#banner img').eq(prev).animate({
				attr : 'y',
				target : 150,
				t : 30,
				step : 10
			}).css('zIndex', 1).opacity(100);
			$('#banner img').eq($(obj).index()).animate({
				attr : 'y',
				target : 0,
				t : 30,
				step : 10
			}).css('top', '-150px').css('zIndex', 2).opacity(100);
		}
		
	}
		
	function banner_fn(){
		if( banner_index >= $('#banner ul li').length() ) banner_index = 0;
		banner( $('#banner ul li').eq(banner_index).first(),(banner_index==0 ? $('#banner ul li').length()-1 : banner_index-1));
		banner_index++;
	}
	
	//手动轮播器
	$('#banner ul li').hover(function(){
		clearInterval(banner_timer);
		if($(this).css('color') != 'rgb(51,51,51)'){
			banner(this , banner_index == 0 ? $('#banner ul li').length()-1 : banner_index - 1 );	
		}
	},function(){
		banner_index = $(this).index() + 1;
		banner_timer = setInterval(banner_fn,2000);
	});
	
	//延迟加载：网站打开时并没有加载图片，可以帮助网站节约流量 
	//预加载：提前加载
	//当图片进去可见区域的时候，将图片的xsrc的地址替换到src即可
	//$('.wait_load').eq(0).attr('src',$('.wait_load').eq(0).attr('xsrc'));
	//获取图片元素到最外层顶点元素的距离
	//alert($('.wait_load').first().offsetTop);
	//获取页面的可视高度 getInner().height  滚动条滑动的高度  getScroll().top);
	
	var wait_load = $('.wait_load');
	wait_load.opacity(0);
	$(window).bind('scroll',wait_imgload);
	$(window).bind('resize',wait_imgload);
	function wait_imgload(){
		setTimeout(function(){
			for(var i=0;i<wait_load.length();i++){
				var _this = wait_load.getEle(i);
				if( getScroll().top + getInner().height  >=  offsetTop(_this) ){
					$(_this).attr('src',$(_this).attr('xsrc')).animate({
						attr:'o',
						target:100,
						t:50,
						step:10
					});
				}	
			}
		},100);
	}
	
	//图片预加载弹窗
	var photo_big = $('#photo_big');
	photo_big.center(620, 511).resize(function () {
		if (reg.css('display') == 'block') {
			screen.lock();
		}
	});
	$('#photo dl dt img').click(function () {
		photo_big.center(620, 511).show();
		screen.lock().animate({
			attr : 'o',
			target : 30,
			t : 30,
			step : 10
		});
			//图片加载
		var temp_img = new Image() ;
		$(temp_img).bind('load',function(){
			$('#photo_big .big img').attr('src',temp_img.src).animate({
				attr:'o',
				target:100,
				t:3000,
				step:10
			}).css('top','0px');
		});
		temp_img.src = $(this).attr('bigsrc');
		//预加载 将当前显示图片的前一张和后一张都先加载完成
		var children = this.parentNode.parentNode ;
		//获取当前节点的上一个节点
		prev_next_img(children);
		
	});
	
	
	$('#photo_big .close').click(function () {
		photo_big.hide();
		screen.animate({
			attr : 'o',
			target : 0,
			t : 30,
			step : 10,
			fn : function () {
				screen.unlock();
			}
		});
	});
	
	//拖拽
	photo_big.drag($('#photo_big h2').first());
	
	//图片鼠标划过
	$('#photo_big .big .left').hover(function(){
		$('#photo_big .big .sl').animate({
			attr:'o',
			target:50,
			t:30,
			step:10
		});
	},function(){
		$('#photo_big .big .sl').animate({
			attr:'o',
			target:0,
			t:30,
			step:10
		});
	});
	$('#photo_big .big .right').hover(function(){
		$('#photo_big .big .sr').animate({
			attr:'o',
			target:50,
			t:30,
			step:10
		});
	},function(){
		$('#photo_big .big .sr').animate({
			attr:'o',
			target:0,
			t:30,
			step:10
		});
	});
	
	//点击 < 显示当前图片上一张 
	$('#photo_big .big .left').click(function () {
	
		$('#photo_big .big img').attr('src', 'img/loading.gif').css('width', '32px').css('height', '32px').css('top', '190px');
	
		var current_img = new Image();
	
		$(current_img).bind('load', function () {
			$('#photo_big .big img').attr('src', current_img.src).animate({
				attr : 'o',
				target : 100,
				t : 30,
				step : 10
			}).opacity(0).css('width', '600px').css('height', '450px').css('top', 0);
		});
		current_img.src = $(this).attr('src');
		var children = $('#photo dl dt img').getEle(prevIndex( $('#photo_big .big img').attr('index'), $('#photo').first() )).parentNode.parentNode;
		prev_next_img(children);
	});
	//点击 > 显示当前图片上一张 
	$('#photo_big .big .right').click(function () {
	
		$('#photo_big .big img').attr('src', 'img/loading.gif').css('width', '32px').css('height', '32px').css('top', '190px');
	
		var current_img = new Image();
	
		$(current_img).bind('load', function () {
			$('#photo_big .big img').attr('src', current_img.src).animate({
				attr : 'o',
				target : 100,
				t : 30,
				step : 10
			}).opacity(0).css('width', '600px').css('height', '450px').css('top', 0);
		});

		current_img.src = $(this).attr('src');
		
		var children = $('#photo dl dt img').getEle(nextIndex( $('#photo_big .big img').attr('index'), $('#photo').first() )).parentNode.parentNode;
		prev_next_img(children);
	});
	function prev_next_img(children){
		var prev = prevIndex($(children).index(),children.parentNode);
		//获取当前节点的下一个节点
		var next = nextIndex($(children).index(),children.parentNode);
		var prev_img = new Image();
		var next_img = new Image();
		
		prev_img.src = $('#photo dl dt img').eq(prev).attr('bigsrc');
		next_img.src = $('#photo dl dt img').eq(next).attr('bigsrc');
		$('#photo_big .big .left').attr('src',prev_img.src);
		$('#photo_big .big .right').attr('src',next_img.src);
		$('#photo_big .big img').attr('index',$(children).index());
		$('#photo_big .big .index').html(parseInt($(children).index())+1  + ' / ' + $('#photo dl dt img').length());
	}
	
	//发表博文弹窗
	$('#blog').center(580, 320).resize(function () {
		if ($('#blog').css('display') == 'block') {
			screen.lock();
		}
	});
	$('#header .member a').eq(0).click(function () {
		$('#blog').center(580, 320).show();
		screen.lock().animate({
			attr : 'o',
			target : 30,
			t : 30,
			step : 10
		});
	});
	$('#blog .close').click(function () {
		$('#blog').hide();
		screen.animate({
			attr : 'o',
			target : 0,
			t : 30,
			step : 10,
			fn : function () {
				screen.unlock();
			}
		});
	});
	
	//拖拽
	$('#blog').drag($('#blog h2').first());
	
	$('form').eq(2).form('sub').click(function () {
		if (trim($('form').eq(2).form('title').value()).length <= 0 || trim($('form').eq(2).form('content').value()).length <= 0) {
			$('#blog .info').html('发表失败：标题或内容不得为空！');
		} else {
			var _this = this;
			$('#loading').show().center(200, 40);
			$('#loading p').html('正在发表博文...');
			_this.disabled = true;
			$(_this).css('backgroundPosition', 'right');
			ajax({
				method : 'post',
				url : 'add_blog.php',
				data : $('form').eq(2).serialize(),
				success : function (text) {
					$('#loading').hide();
					if (text == 1) {	
						$('#blog .info').html('');
						$('#success').show().center(200, 40);
						$('#success p').html('发表成功，请稍后...');
						setTimeout(function () {
							$('#success').hide();
							$('#blog').hide();
							$('form').eq(2).first().reset();
							screen.animate({
								attr : 'o',
								target : 0,
								t : 30,
								step : 10,
								fn : function () {
									screen.unlock();
									//获取博文列表
									$('#index').html('<span class="loading"></span>');
									$('#index .loading').show();
									ajax({
										method : 'GET',
										url : 'get_blog.json',
										data : {},
										success : function (text) {															
											$('#index .loading').hide();
											var json = JSON.parse(text);
											var html = '';
											for (var i=0;i< json.title.length;i++) {
												html += '<div class="content"><h2>' + json.title[i] + '</h2><p>' + json.content[i] + '</p></div>';
												
											}
											$('#index').html(html);
											for (var i = 0; i < json.title.length; i ++) {
												$('#index .content').eq(i).animate({
													attr : 'o',
													target : 100,
													t : 30,
													step : 10
												});
											}
										},
										async : true
									});
									
								}
							});
							_this.disabled = false;
							$(_this).css('backgroundPosition', 'left');
						}, 1500);
					}
				},
				async : true
			});
		}
	});
	
	//获取博文列表
	$('#index').html('<span class="loading"></span>');
	$('#index .loading').show();
	ajax({
		method : 'GET',
		url : 'get_blog.json',
		data : {},
		success : function (text) {
			$('#index .loading').hide();
			var json = JSON.parse(text);
			var html = '';
			for (var i=0;i< json.title.length;i++) {
				html += '<div class="content"><h2>' + json.title[i] + '</h2><p>' + json.content[i] + '</p></div>';
				
			}
			$('#index').html(html);
			for (var i = 0; i < json.title.length; i ++) {
				$('#index .content').eq(i).animate({
					attr : 'o',
					target : 100,
					t : 30,
					step : 10
				});
			}
		},
		async : true
	});
	
	
	//更换皮肤弹窗
	$('#skin').center(650, 380).resize(function () {
		if ($('#skin').css('display') == 'block') {
			screen.lock();
		}
	});
	$('#header .member a').eq(1).click(function () {
		$('#skin').center(650, 360).show();
		screen.lock().animate({
			attr : 'o',
			target : 30,
			t : 30,
			step : 10
		});
		$('#skin .skin_bg').html('<span class="loading"></span>');
		ajax({
			method : 'post',
			url : 'get_skin.php',
			data : {
				'type' : 'all'
			},
			success : function (text) {
				var json = JSON.parse(text);
				var html = '';
				for (var i = 0; i < json.length; i ++) {
					html += '<dl><dt><img src="img/' + json[i].small_bg + '" big_bg="' + json[i].big_bg + '" bg_color="' + json[i].bg_color + '" alt=""></dt><dd>' + json[i].bg_text + '</dd></dl>';
				}
				$('#skin .skin_bg').html(html).opacity(0).animate({
					attr : 'o',
					target : 100,
					t : 30,
					step :10
				});
				$('#skin dl dt img').click(function () {
					$('body').css('background', $(this).attr('bg_color') + ' ' + 'url(img/' + $(this).attr('big_bg') + ') repeat-x');
					ajax({
						method : 'post',
						url : 'get_skin.php',
						data : {
							'type' : 'set',
							'big_bg' : $(this).attr('big_bg')
						},
						success : function (text) {
							$('#success').show().center(200, 40);
							$('#success p').html('皮肤更换成功...');
							setTimeout(function () {
								$('#success').hide();
							}, 1500);
						},
						async : true
					});
				});
			},
			async : true
		});
	});
	$('#skin .close').click(function () {
		$('#skin').hide();
		screen.animate({
			attr : 'o',
			target : 0,
			t : 30,
			step : 10,
			fn : function () {
				screen.unlock();
			}
		});
	});
	//拖拽
	$('#skin').drag($('#skin h2').last());
	
	/*默认显示背景皮肤样式
	ajax({
		method : 'post',
		url : 'get_skin.php',
		data : {
			'type' : 'main'
		},
		success : function (text) {
			console.log(text);
			var json = JSON.parse(text);
			$('body').css('background', json.bg_color + ' ' + 'url(img/' + json.big_bg + ') repeat-x');
		},
		async : true
	});*/
		
});
