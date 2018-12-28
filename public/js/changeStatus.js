$( function() {
	// 异步传输更改状态
	$('.change').click(function(e) {
		var target = $(e.target)
		var url = target.data('url')
		var newStatus = target.data('sts')
		var id = target.data('id')
		$.ajax({
			type: 'GET',
			url: url + '?id=' + id + '&newStatus=' + newStatus
		})
		.done(function(results) {
			if(results.success === 1) {
				alert(results.info)
				location.reload();
			} else if(results.success === 0) {
				alert(results.info)
			}
			// 不能把 alert(results.info) 提取出来
		})
	})
} );