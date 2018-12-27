$(function() {
	var i = 0
	$('#addContact').click(function(e) {
		i += 1
		var j=i-1
		str = '<div class="form-group row contact' + i +'" id="contact' + i +'">'
			str += '<label class="col-md-2 col-form-label"> contact' + i +' </label>'
			str += '<div class="col-md-3">'
				str += '<input class="form-control" type="text", name="object[contacts]['+j+'][contacter]", placeholder="contacter<position>"/>'
			str += '</div>'
			str += '<div class="col-md-3">'
				str += '<input class="form-control" type="text", name="object[contacts]['+j+'][tel]", placeholder="telephone"/>'
			str += '</div>'
			str += '<div class="col-md-4">'
				str += '<input class="form-control" type="text", name="object[contacts]['+j+'][email]", placeholder="email""/>'
			str += '</div>'
		str += '</div>'
		$('.contact'+j).after(str)
	})

	$('#delContact').click(function(e) {
		$("#contact"+i).remove()
		i -= 1
	})

	$('#iptCode').blur(function() {
		var vendorCode = $(this).val()
		vendorCode = vendorCode.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		if(vendorCode.length > 0){
			var code = encodeURIComponent(vendorCode)
			$.ajax({
				type: 'get',
				url: '/ajaxCodeVendor?keytype=code&keyword=' + code
			})
			.done(function(results) {
				if(results.success === 1) {
					$("#optCode").text("已有此供应商");
					$("#sub").hide();
					$("#back").show();
				} else {
					$("#optCode").text("");
					$("#sub").show();
					$("#back").hide();
				}
			})
		} else {
			$("#optCode").text("请输入供应商名称");
		}
	})

	$("#iptVtype").change(function(e) {
		if($(this).val() < 0) {
			$("#optVtype").text("Please Select Type");
		} else {
			$("#optVtype").text("");
		}
	})

	$("#add").submit(function(e) {
		if($("#iptCode").val().length < 1) {
			$("#optCode").text("请输入供应商名称");
			e.preventDefault();
		}
		else if($("#iptVtype").val() < 0) {
			$("#optVtype").text("Please Select Type");
			e.preventDefault();
		}
	})
})