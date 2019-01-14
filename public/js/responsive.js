$(function() {
	var divContainer = $(".container");
	window.onload=function(){
		if($(window).width() < 1200) {
			divContainer.removeClass("container");
		}
	}
	//当浏览器窗口大小改变时，设置显示内容的高度
	window.onresize=function(){
		if($(window).width() < 1200) {
			divContainer.removeClass("container");
		} else {
			divContainer.addClass("container");
		}
	}
})