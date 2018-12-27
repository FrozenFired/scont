$(function() {
	$('#iptCateFir').change(function() {
		$('.opn').remove()				// 先移除table下的其他信息
		var bcate = $(this).val()
		if(bcate > -1){
			$.ajax({
				type: 'get',
				url: '/ajaxBcateg?keytype=bcate&keyword=' + bcate
			})
			.done(function(results) {
				if(results.success === 1) {
					let bcategs = results.bcategs
					for(i = 0; i <bcategs.length; i++){			// 把数据添加上去
						var option = '<option class="opn" value='+bcategs[i]._id+"> "+bcategs[i].code+" </option>"
						$("#iptCateg").append(option)
					}
				} else {
					alert(results.info)
				}
			})
		}
		$("#optCateg").text("Please Select Category");
	})

	$('#iptCateg').change(function() {
		if($(this).val().length > 10){
			$("#optCateg").text("");
		} else {
			$("#optCateg").text("Please Select Category");
		}
	})
})