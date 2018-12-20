$( function() {
	// 异步传输更改状态
	$('.changeStatus').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		var newStatus = target.data('newstatus')
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'GET',
			url: 'taskStatus?id=' + id + '&newStatus=' + newStatus
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

	// 更新note 隐藏显示表单
	$('.btnEdit').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		$('.tar-'+id).val($('.ipt-'+id).val())
		$('.cancel-'+id).show()
		$('.form-'+id).show()
		$('.edit-'+id).hide()
		$('.text-'+id).hide()
	})
	$('.btnCancel').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		$('.edit-'+id).show()
		$('.text-'+id).show()
		$('.cancel-'+id).hide()
		$('.form-'+id).hide()
	})
} );