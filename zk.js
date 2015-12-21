/**
 * 0.1.0.20151218
 */

var zk = {};

/**
 * zk.on
 * 事件绑定
 * 在bootstrap中 如果想禁用特定插件的默认行为，只需要禁用该插件所在命名空间下的事件即可： $(document).off('.alert.data-api');
 */
zk.on = function(obj, event, func){
	$(document).off(event, obj).on(event, obj, func);
};

/**
 * zk.cookie
 * 对jquery.cookie.js稍作封装
 * 注：需要引入jquery.cookie.js，<script src="http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
 * zk.cookie(key)：返回key对应的value
 * zk.cookie(key, null)： 删除key对应的cookie
 * zk.cookie(key, value)：设置key-value的cookie
 * 可以参考：plugins/_05_qcookie/qcookie.html
 */
zk.cookie = function(key, value){
	if(typeof value == 'undefined'){
		return $.cookie(key);
	}else if(value == null){
		$.cookie(key, value, {path:'/', expires: -1});
	}else{
		$.cookie(key, value, {path:'/', expires:1});
	}
};

/**
 * zk.bs
 * 1.alert
 * 2.confirm
 * 3.dialog
 * 4.msg
 * 5.popover
 */
zk.bs 	= {};
//默认选项
zk.bs.modaloptions = {
	id: 'basemodal',//模态框id
	url : '',
	fade: 'fade',//动画效果 淡入淡出
	close: true,//右上角关闭按钮
	head: true,
	title: 'title',//必须head为true,才会显示title
	foot: true,//是否显示确定按钮  false则按钮都不显示
	btn: false,//是否显示取消按钮  默认不显示 
	okbtn: '确定',
	obbtnclass:'btn-primary',//确定按钮 默认样式 为bootstrap的btn-primary
	obbtnstyle:'',//确定按钮 自定义 行内样式
	clbtn: '取消',
	clbtnclass:'btn-default',//取消按钮 默认样式 为bootstrap的btn-default
	clbtnstyle:'',//取消按钮 自定义 行内样式
	msg: 'msg',
	isbig: false,//大模态框、小模态框  默认为小模态框
	show: false,
	remote: false,//如果提供的是 URL，将利用 jQuery 的 load 方法从此 URL 地址加载要展示的内容（只加载一次）并插入 .modal-content 内。如果使用的是 data 属性 API，还可以利用 href 属性指定内容来源地址。
	backdrop: 'static',//遮罩层
	keyboard: true,//键盘上的 esc 键被按下时  关闭模态框。
	style: '',//modal 自定义样式
	mstyle: '',//模态框自定义样式
	callback: null
};
zk.bs.modalstr = function(opt){
	var start = '<div class="modal '+opt.fade+'" id="' + opt.id + '" tabindex="-1" role="dialog" aria-labelledby="bsmodaltitle" aria-hidden="true" style="position:fixed;top:20px;'+opt.style+'">';
	if(opt.isbig){
		start += '<div class="modal-dialog modal-lg" style="'+opt.mstyle+'"><div class="modal-content">';
	}else{
		start += '<div class="modal-dialog" style="'+opt.mstyle+'"><div class="modal-content">';
	}
	var end = '</div></div></div>';
	
	var head = '';
	if(opt.head){
		head += '<div class="modal-header">';
		if(opt.close){
			head += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
		}
		head += '<h3 class="modal-title" id="bsmodaltitle">'+opt.title+'</h3></div>';
	}
	
	var body = '<div class="modal-body"><p><h4>'+opt.msg+'</h4></p></div>';
	
	var foot = '';
	if(opt.foot){
		foot += '<div class="modal-footer"><button type="button" class="btn '+opt.obbtnclass+' bsok" style="'+opt.obbtnstyle+'">'+opt.okbtn+'</button>';
		if(opt.btn){
			foot += '<button type="button" class="btn '+opt.clbtnclass+' bscancel" style="'+opt.clbtnstyle+'">'+opt.clbtn+'</button>';
		}
		foot += '</div>';
	}
	
	return start + head + body + foot + end;
};

/**
 *1.alert
 */
zk.bs.alert = function(options, callback){
	// 默认options
	var opt = $.extend({}, zk.bs.modaloptions);
	
	opt.title = '提示';
	if(typeof options == 'string'){
		opt.msg = options;
	}else{
		$.extend(opt, options||{});
	}
	
	// add
	$('body').append(zk.bs.modalstr(opt));
	
	// init
	var $modal = $('#' + opt.id); 
	$modal.modal(opt);
	
	// bind
	zk.on('button.bsok', 'click', function(){
		if(callback && callback instanceof Function) callback();
		$modal.modal('hide');
	});
	
	//clear html
	zk.on('#' + opt.id, 'hidden.bs.modal', function(){
		$modal.remove();
	});
	
	// show
	$modal.modal('show');
};

/**
 *2.confirm
 */
zk.bs.confirm = function(options, okcallback, cancelcallback){
	// options
	var opt = $.extend({}, zk.bs.modaloptions);

	opt.title = '确认操作';
	if(typeof options == 'string'){
		opt.msg = options;
	}else{
		$.extend(opt, options);
	}
	opt.btn = true;
	
	// append
	$('body').append(zk.bs.modalstr(opt));
	
	// init
	var $modal = $('#' + opt.id); 
	$modal.modal(opt);
	
	// bind
	zk.on('button.bsok', 'click', function(){
		if(okcallback && okcallback instanceof Function) okcallback();
		$modal.modal('hide');
	});
	zk.on('button.bscancel', 'click', function(){
		if(cancelcallback && cancelcallback instanceof Function) cancelcallback();
		$modal.modal('hide');
	});
	zk.on('#' + opt.id, 'hidden.bs.modal', function(){
		$modal.remove();
	});
	
	// show
	$modal.modal('show');
};

/**
 *3.dialog
 */
zk.bs.dialog = function(options, okcallback){
	// options
	var opt = $.extend({}, zk.bs.modaloptions, options);
	opt.big = true;
	
	// append
	$('body').append(zk.bs.modalstr(opt));
	
	// ajax page
	$.ajax({
		url:options.url,
		dataType:'html',
		success:function(html){
			$('#' + opt.id + ' div.modal-body').empty().append(html);
		if(options.callback && options.callback instanceof Function) options.callback();
		}
	});
		
	// init
	var $modal = $('#' + opt.id); 
	$modal.modal(opt);
	
	// bind
	zk.on('button.bsok', 'click', function(){
		var flag = true;
		if(okcallback && okcallback instanceof Function){
			flag = okcallback();
		}
		
		if(flag){
			$modal.modal('hide');
		}
	});
	zk.on('button.bscancel', 'click', function(){
		$modal.modal('hide');
	});
	zk.on('#' + opt.id, 'hidden.bs.modal', function(){
		$modal.remove();
	});
	
	// show
	$modal.modal('show');
};

/**
 *4.msg
 */
zk.bs.msgoptions = {
	msg : 'msg', //内容
	style: 'info',//颜色  default  primary success info warning danger
	time: 2000,//毫秒 多长时间后自动消失
	position: 'top',//位置  top bottom
};
zk.bs.msgstr = function(msg, style, position){
	return '<div class="alert alert-'+style+' alert-dismissible" role="alert" style="display:none;position:fixed;' + position + ':0;left:0;width:100%;z-index:2001;margin:0;text-align:center;" id="bsalert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+msg+'</div>';
};
zk.bs.msg = function(options){
	var opt = $.extend({},zk.bs.msgoptions);
	
	if(typeof options == 'string'){
		opt.msg = options;
	}else{
		$.extend(opt, options);
	}
	
	$('body').prepend(zk.bs.msgstr(opt.msg, opt.style , opt.position));
	$('#bsalert').slideDown();
	setTimeout(function(){
		$('#bsalert').slideUp(function(){
			$('#bsalert').remove();
		});
	},opt.time);
};

	/**
	*5.popover
	*/
zk.bs.popoptions = {
	animation : true,
	container : 'body',
	content	: 'content',
	html: true,
	placement: 'bottom',
	title: '',
	trigger: 'hover'//click | hover | focus | manual.
};

$.fn.bspop= function(options){
	var opt = $.extend({}, zk.bs.popoptions);
	if(typeof options == 'string'){
		opt.content = options;
	}else{
		$.extend(opt, options);
	}
	
	$(this).popover(opt);
};



zk.bs.bsdateoptions = {
	autoclose: true,
	language : 'zh-CN',
	format: 'yyyy-mm-dd'
};
zk.bs.bsdate = function(selector, options){
	if(selector){
		var $element = $(selector);
		if($element.length > 0){
			var opt = $.extend({}, zk.bs.bsdateoptions, options);
			$element.each(function(){
				$(this).datepicker(opt);
			});
		}
	}
};
zk.bs.bstrooptions = {
	width 	: '500px',
	html 	: 'true',
	nbtext	: '下一步',
	place 	: 'bottom',
	title 	: '网站使用引导',
	content : 'content'
};
zk.bs.bstroinit = function(selector, options, step){
	if(selector){
		var $element = $(selector);
		if($element.length > 0){
			var opt = $.extend({}, zk.bs.bstrooptions, options);
			if(typeof options == 'string'){
				opt.content = options;
			}else{
				$.extend(opt, options);
			}
			
			$element.each(function(){
				$(this).attr({
					'data-bootstro-width'			: opt.width, 
					'data-bootstro-title' 			: opt.title, 
					'data-bootstro-html'			: opt.html,
					'data-bootstro-content'			: opt.content, 
					'data-bootstro-placement'		: opt.place,
					'data-bootstro-nextButtonText'	: opt.nbtext,
					'data-bootstro-step'			: step
				}).addClass('bootstro');
			});
		}
	}
};
zk.bs.bstroopts = {
	prevButtonText : '上一步',
	finishButton : '<button class="btn btn-lg btn-success bootstro-finish-btn"><i class="icon-ok"></i>完成</button>',
	stopOnBackdropClick : false,
	stopOnEsc : false
};
zk.bs.bstro = function(bss, options){
	if(bss && bss.length > 0){
		for(var i=0; i<bss.length; i++){
			zk.bs.bstroinit(bss[i][0], bss[i][1], i);
		}
		
		var opt = $.extend({}, zk.bs.bstroopts);
		if(options){
			if(options.hasOwnProperty('pbtn')){
				opt.prevButtonText = options.pbtn;
			}
			if(options.hasOwnProperty('obtn')){
				if(options.obtn == ''){
					opt.finishButton = '';
				}else{
					opt.finishButton = '<button class="btn btn-mini btn-success bootstro-finish-btn"><i class="icon-ok"></i>'+options.obtn+'</button>';
				}
			}
			if(options.hasOwnProperty('stop')){
				opt.stopOnBackdropClick = options.stop;
				opt.stopOnEsc = options.stop;
			}
			if(options.hasOwnProperty('exit')){
				opt.onExit = options.exit;
			}
		}
		
		bootstro.start('.bootstro', opt);
	}
};
