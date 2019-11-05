$( function() {
	$('#iptTaxType').change(function(e) {
		if($(this).val() != 0) {
			$('.acFattura').show()
		} else {
			$('.acFattura').hide()
		}
	})


	var iAttrib = 0
	$('#addAttrib').click(function(e) {
		iAttrib += 1
		var j=iAttrib-1
		str = '<div class="form-group row attrib' + iAttrib +'" id="attrib' + iAttrib +'">'
			str += '<label class="col-lg-2 col-form-label"> goods ' + iAttrib +' </label>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][code]", value='+iAttrib+' placeholder="Goods No."/>'
			str += '</div>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][hs]", placeholder="HS Code"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods['+j+'][brand]", placeholder="Brand Name"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods['+j+'][order]", placeholder="Order"/>'
			str += '</div>'
			str += '<label class="col-lg-2"></label>'
			str += '<div class="col-lg-2 text-right pt-1">'
				str += '<h4> UM: No.</h4>'
			str += '</div>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="number", name="goods['+j+'][quot]", value=0 placeholder="Qty."/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="number", name="goods['+j+'][price]", value=0 placeholder="Price"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="number", name="goods['+j+'][tot]", value=0 placeholder="total"/>'
			str += '</div>'

			str += '<label class="col-lg-2"></label>'
			str += '<div class="col-lg-10">'
				str += '<textarea class="form-control" rows=5, name="goods['+j+'][desp]", placeholder="Description"/>'
			str += '</div>'
		str += '</div>'
		$('.attrib'+j).after(str)
	})

	$('#delAttrib').click(function(e) {
		$("#attrib"+iAttrib).remove()
		iAttrib -= 1
	})

	var iAttrib = 0
	$('#addAttrib').click(function(e) {
		iAttrib += 1
		var j=iAttrib-1
		str = '<div class="form-group row attrib' + iAttrib +'" id="attrib' + iAttrib +'">'
			str += '<label class="col-lg-2 col-form-label"> goods ' + iAttrib +' </label>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][code]", value='+iAttrib+' placeholder="Goods No."/>'
			str += '</div>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][hs]", placeholder="HS Code"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods['+j+'][brand]", placeholder="Brand Name"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="text", name="goods['+j+'][order]", placeholder="Order"/>'
			str += '</div>'
			str += '<label class="col-lg-2"></label>'
			str += '<div class="col-lg-2 text-right pt-1">'
				str += '<h4> UM: No.</h4>'
			str += '</div>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="number", name="goods['+j+'][quot]", value=0 placeholder="Qty."/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="number", name="goods['+j+'][price]", value=0 placeholder="Price"/>'
			str += '</div>'
			str += '<div class="col-lg-3">'
				str += '<input class="form-control" type="number", name="goods['+j+'][tot]", value=0 placeholder="total"/>'
			str += '</div>'

			str += '<label class="col-lg-2"></label>'
			str += '<div class="col-lg-10">'
				str += '<textarea class="form-control" rows=5, name="goods['+j+'][desp]", placeholder="Description"/>'
			str += '</div>'
		str += '</div>'
		$('.attrib'+j).after(str)
	})

	$('#delAttrib').click(function(e) {
		$("#attrib"+iAttrib).remove()
		iAttrib -= 1
	})
} );