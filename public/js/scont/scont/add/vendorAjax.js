$(function() {
	$('#ajaxIptVendorCode').blur(function(e) {
		var target = $(e.target)
		var url = target.data('url')
		// alert(url)

		$('#filterVendor tr').remove()				// 先移除table下的其他信息
		var vendorCode = $(this).val()
		vendorCode = vendorCode.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		if(vendorCode.length > 0){
			var code = encodeURIComponent(vendorCode)
			$.ajax({
				type: 'get',
				url: url+'?keytype=code&keyword=' + code
			})
			.done(function(results) {
				$("#alertVendor").hide()
				if(results.success === 1) {
					$('.divAddVendor').hide();
					$('#matchVendors').hide();
					if(results.vendor.status != 2) {
						$("#ajaxOptVendorCode").text('Vendor is Inputed');
						$('#vendorCode').val(results.vendor.code);
						$('#scontVendor').val(results.vendor._id);			// scont中的 vendor赋值
					} else{
						$("#alertVendor").show()
						$("#ajaxOptVendorCode").text('Vendor is gray')
						$('#scontVendor').val("");					// scont中的 vendor的值变空
					}
				} else {
					$("#ajaxOptVendorCode").text('Please Complete the Vendor Code')
					$('.divAddVendor').show();					// 显示添加vendor的表单
					$('#scontVendor').val("completed");					// scont中的 vendor的值变空
					$('#vendorCode').val(vendorCode); 			// 把vendor.code的值填上
					if(results.success === 2) {
						$('#matchVendors').show();					// 显示模糊列表
						if(results.vendors.length > 5) vLen = 5;
						else vLen = results.vendors.length;
						for(i = 0; i <vLen; i++){			// 把数据添加上去
							var tr = "<tr class='addItem'><td>" + results.vendors[i].code + "</td></tr>"
							$("#filterVendor").append(tr)
						}
					}
				}
			})
		} else {
			$("#alertVendor").show()
			$("#ajaxOptVendorCode").text('Please complete the Vendor Code')
			$('#scontVendor').val("");					// scont中的 vendor的值变空
			$('#vendorCode').val(""); 				// 把vendor.code的值变空
			$('.divAddVendor').hide();					// Hide vendor的添加表单
		}
	})
})