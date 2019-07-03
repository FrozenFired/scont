$(function() {
	$(".show").click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		$(this).hide();
		$(".hide-"+id).show();
		$(".more-"+id).show();
	})
	$(".hide").click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		$(this).hide();
		$(".show-"+id).show();
		$(".more-"+id).hide();
	})
})