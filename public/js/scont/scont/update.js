$(function() {
	$("#updateScont").on('input', '#updaterCode', function(e) {
	// $("#updaterCode").blur(function(e) {
		$("#iptUpdater").val("")
		$("#optUpdater").text("")
		$('#matchSfer').hide();
		$('#filterSfer tr').remove()				// 先移除table下的其他信息
		
		let sferCode = $(this).val();
		sferCode = sferCode.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		if(sferCode.length > 0){
			var code = encodeURIComponent(sferCode)
			$.ajax({
				type: 'get',
				url: '/ajaxSfer?keytype=code&keyword=' + code
			})
			.done(function(results) {
				if(results.success === 1) {
					$("#iptUpdater").val(results.sfer._id)
				} else if(results.success === 2) {
					$('#matchSfer').show();					// 显示模糊列表
					let sfers = results.sfers
					for(i = 0; i < sfers.length; i++){			// 把数据添加上去
						var tr = "<tr class='addItem'><td>" + sfers[i].code + "</td></tr>"
						$("#filterSfer").append(tr)
					}
				} else {
					$("#optUpdater").text("Invalid Account")
				}
			})

		} else {
			$("#optUpdater").text("Please Insert Updater")
		}
	})

	$("#updateScont").submit(function(e) {
		if($("#iptUpdater").val().length < 2) {
			$("#optUpdater").text("Please Insert Updater")
			e.preventDefault();
		}
	})
})