$( function() {
	// $(".datepicker").datepicker();
	// alert(1)
	$("#unCheck").text($(".unCheck").val())
	$("#checking").text($(".checking").val())
	$("#checked").text($(".checked").val())

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
		$('.hideBtn').show()
		$(this).hide()
		$(".hideTr").show()
	})
	$('.hideBtn').click(function(e) {
		$('.showHide').show()
		$(this).hide();
		$(".hideTr").hide()
	})

	$(".imgSm").click(function(e) {
		let str = $(this).attr('id');
		let id = str.split('-')[1]
		$(this).hide();
		$("#imgBg-"+id).show();
	})
	$(".imgBg").click(function(e) {
		let str = $(this).attr('id');
		let id = str.split('-')[1]
		$(this).hide();
		$("#imgSm-"+id).show();
	})
} );