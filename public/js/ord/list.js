$( function() {
	// $(".datepicker").datepicker();
	// alert(1)
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
	$('.showHide').click(function(e) {
		$(".hideTr").show()
	})
} );