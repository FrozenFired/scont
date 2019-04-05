$(function() {
	$('.del').click(function(e) {
		var target = $(e.target)
		var urlDel = target.data('urldel')
		var id = target.data('id')
		var element = $('.item-id-' + id)
		$.ajax({
			type: 'DELETE',
			url: urlDel + '?id=' + id
		})
		.done(function(results) {
			if(results.success === 1) {
				if(element.length > 0) {
					element.remove()
				}
			}
			if(results.success === 0) {
				alert(results.failDel)
			}
		})
	})
})