$( function() {
	var i = 0
	$('#addAttrib').click(function(e) {
		i += 1
		var j=i-1
		str = '<div class="form-group row attrib' + i +'" id="attrib' + i +'">'
			str += '<label class="col-lg-2 col-form-label"> goods ' + i +' </label>'
			str += '<div class="col-lg-2">'
				str += '<input class="form-control" type="text", name="goods['+j+'][code]", value='+i+' placeholder="Goods No."/>'
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
		$("#attrib"+i).remove()
		i -= 1
	})
} );