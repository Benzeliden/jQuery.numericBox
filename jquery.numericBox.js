/**
 * @author denis.krasakov@gmail.com
 *
 */
(function($) {	
	var notNumberRegexp = new RegExp('[^0-9]', 'g');
	var pointSymbol = ".";
	
	var defaultOptions = {
		scale: 6, 
		max: 99999.999,
		min: -99999.999,
		separator: ".",
	};
		
	function fixNumber2(number, options){
		var separatorPos = number.indexOf(options.separator);
		var hasPoint = options.canBeFloat && separatorPos > -1;
		var isNegative = number[0] == "-";
		var start = isNegative ? 1 : 0;		
            		
		//console.log("start", number, hasPoint, separatorPos);
		var	resultNumberStr = number.substring(start, hasPoint ? separatorPos : number.length).replace(notNumberRegexp, '');
		if (hasPoint) {
			var fraction = number.substring(separatorPos + 1).replace(notNumberRegexp, '');
			resultNumberStr += pointSymbol + fraction.substring(0, options.scale);
		}
		
		var resultNumberInt = isNegative ? -resultNumberStr : +resultNumberStr;
		//console.log("result str = '" + resultNumberStr + "', int = " + resultNumberInt);
		
		var isOutOfRange = false;
		if (resultNumberInt > options.max){
			resultNumberInt = options.max;
			isOutOfRange = true;
		} else if (resultNumberInt < options.min){
			resultNumberInt = options.min;
			isOutOfRange = true;
		}
		
		if (isOutOfRange)		
			//todo inner func
			return resultNumberInt.toString().replace(pointSymbol, options.separator);
			
		return (isNegative ? "-" : "") + resultNumberStr.replace(pointSymbol, options.separator);
	}
		
	//console.log(fixNumber2("333.4,5.6.",defaultOptions));
	//console.log(fixNumber2("3334343433,4.5.6.",defaultOptions));
	//console.log(fixNumber2("-33-553.4,5.6.",defaultOptions));
	
	
    $.fn.numericBox = function( options ) {
		
        options = $.extend( defaultOptions, options );				
		options.canBeFloat = options.scale > 0;
		
		var previousSelection = -1;
		var previousValue = this.value;
		function fixSelection(elem, selectionPosition){
			
		}
		
        $( this ).on('keydown keyup paste input', function() {
			
			var newValue = fixNumber2(this.value, options);
			if (newValue !== this.value){
				this.value = newValue;
				
				//if user enter invalid character return caret to previous position
				if (previousSelection != -1 && newValue == previousValue) {
					this.setSelectionRange(previousSelection,previousSelection);
				}				
				previousValue = newValue;
			}
			previousSelection = this.selectionStart;
            return true;
        }).on("blur", function() {
			if (this.value.length == 0 || this.value ==  "-") {
				this.value = "0";
			}
		});
        return $( this );
    };
})( jQuery );
