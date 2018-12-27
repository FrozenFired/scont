$(function() {
	$('#iptCode').blur(function() {
		var brandCode = $(this).val()
		brandCode = brandCode.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		if(brandCode.length > 0){
			var code = encodeURIComponent(brandCode)
			$.ajax({
				type: 'get',
				url: '/ajaxCodeBrand?keytype=code&keyword=' + code
			})
			.done(function(results) {
				if(results.success === 1) {
					$("#optCode").text("已有此品牌");
					$("#sub").hide();
					$("#back").show();
				} else {
					$("#optCode").text("");
					$("#sub").show();
					$("#back").hide();
				}
			})
		} else {
			$("#optCode").text("请输入品牌名称");
		}
	})

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

	$("#add").submit(function(e) {
		if($("#iptCode").val().length < 1) {
			$("#optCode").text("请输入品牌名称");
			e.preventDefault();
		}
		else if($("#iptCateg").val().length < 10) {
			$("#optCateg").text("Please Select Category");
			e.preventDefault();
		}
	})
})