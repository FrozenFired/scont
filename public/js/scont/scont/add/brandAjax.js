$(function() {
	$('#ajaxIptBrandCode').blur(function() {
		$('#filterBrand tr').remove()				// 先移除table下的其他信息
		var brandCode = $(this).val()
		brandCode = brandCode.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		if(brandCode.length > 0){
			var code = encodeURIComponent(brandCode)
			$.ajax({
				type: 'get',
				url: '/ajaxCodeBrand?keytype=code&keyword=' + code
			})
			.done(function(results) {
				$("#alertBrand").hide()
				if(results.success === 1) {
					$('.divAddBrand').hide();
					$('#matchBrands').hide();
					if(results.brand.status != 1) {
						$("#ajaxOptBrandCode").text('Brand is Inputed');
						$('#brandCode').val(results.brand.code);
						$('#scontBrand').val(results.brand._id);			// scont中的 brand赋值
					} else{
						$("#alertBrand").show()
						$("#ajaxOptBrandCode").text('Brand is gray')
						$('#scontBrand').val("");					// scont中的 brand的值变空
					}
				} else {
					$("#ajaxOptBrandCode").text('Please Complete the Brand Code')
					$('.divAddBrand').show();					// 显示添加brand的表单
					$('#scontBrand').val("completed");					// scont中的 brand的值变空
					$('#brandCode').val(brandCode); 			// 把brand.code的值填上
					if(results.success === 2) {
						$('#matchBrands').show();					// 显示模糊列表
						if(results.brands.length > 5) bLen = 5;
						else bLen = results.brands.length;
						for(i = 0; i <bLen; i++){			// 把数据添加上去
							var tr = "<tr class='addItem'><td>" + results.brands[i].code + "</td></tr>"
							$("#filterBrand").append(tr)
						}
					}
				}
			})
		} else {
			$("#alertBrand").show()
			$("#ajaxOptBrandCode").text('Please complete the Brand Code')
			$('#scontBrand').val("");					// scont中的 brand的值变空
			$('#brandCode').val(""); 				// 把brand.code的值变空
			$('.divAddBrand').hide();					// Hide brand的添加表单
		}
	})
})