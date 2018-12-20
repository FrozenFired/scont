$(function() {
	$('.del').click(function(e) {
		var target = $(e.target)
		var urlDel = target.data('urldel')
		var id = target.data('id')
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'DELETE',
			url: urlDel + '?id=' + id
		})
		.done(function(results) {
			if(results.success === 1) {
				if(tr.length > 0) {
					tr.remove()
				}
			}
			if(results.success === 0) {
				alert(results.failDel)
			}
		})
	})
})