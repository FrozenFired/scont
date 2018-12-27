$(function() {
	$('.changSts').click(function(e) {
		var target = $(e.target)
		var url = target.data('url')
		var sts = target.data('sts')
		$.ajax({
			type: 'GET',
			url: url + '?sts=' + sts
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