/**
 * @author denis.krasakov@gmail.com
 *
 */
(function($) {	
	"use strict"
	var notNumberRegexp = new RegExp('[^0-9]', 'g');
	var pointSymbol = ".";
	var typeOfFunction = typeof function(){};
	var typeOfStr = typeof '';
	var pluginName = 'numericBox';
		
	function fixNumber(number, options){
		var separatorPos = number.indexOf(options.separator);
		var hasPoint = options.scale > 0 && separatorPos > -1;
		var isNegative = number[0] == "-";
		var start = isNegative ? 1 : 0;		
            		
		var	resultNumberStr = number.substring(start, hasPoint ? separatorPos : number.length).replace(notNumberRegexp, '');
		if (hasPoint) {
			var fraction = number.substring(separatorPos + 1).replace(notNumberRegexp, '');
			resultNumberStr += pointSymbol + fraction.substring(0, options.scale);
		}
		
		var resultNumberInt = isNegative ? -resultNumberStr : +resultNumberStr;
		
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
	
	function ProcessSetup(options, setupOptions, $elem) {
		var $data = $elem.data();
	
		for (var optionName in setupOptions) {
			if (setupOptions.hasOwnProperty(optionName)) {
				var optionConfig = setupOptions[optionName];
				var configType = typeof optionConfig;
				var optionVal = undefined;

				switch(configType) {
					case typeOfStr:
						var attrs = optionConfig.split(',');
						for	(var i = 0, len = attrs.length; i < len; i++){
							if ($data[attrs[i]] != undefined){
								optionVal = $data[attrs[i]];	
								break;								
							}
						}
						break;
					case typeOfFunction:
						optionVal = optionConfig($elem);
						break;
				}

				if (optionVal !== undefined) {
					options[optionName] = optionVal;
				}
			}
		}
	}
	
	function numericBox(element, options) {
        var baseOptions = $.extend({}, $.fn.numericBox.defaultOptions),
            $this = $(element),
			self = this;
			
		var setup = $.extend({}, $.fn.numericBox.defaultOptions.setup, options != undefined ? options.setup : undefined);
		
		ProcessSetup(baseOptions, setup, $this);

        self.options = $.extend(baseOptions, options);
		self.destroy = function(){			
			$this
				.off('keydown keypress keyup paste input', processInput)
				.off("blur", processBlur)
				.off("focus", processFocus)
				.removeData(pluginName, undefined);
		};
		self.init = function(){			
			$this
				.on('keydown keypress keyup paste input', processInput)
				.on("blur", processBlur)
				.on("focus", processFocus)
				.data(pluginName,self);
		}
		self.setOptions = function(newOptions){
			$.extend(self.options, newOptions);
			processInput.call(element);
		}
		
		
        var previousSelection = -1;
        var previousValidValue = element.value;
		function processInput() {
			var input = this;
			var oldValue = input.value;
            var newValue = fixNumber(oldValue, self.options);
            if (newValue !== oldValue) {
                input.value = newValue;
                //if user enter invalid character return caret to previous position
                if (previousSelection !== -1 && newValue === previousValidValue) {
                    input.setSelectionRange(previousSelection, previousSelection);
                }
            }
			previousValidValue = newValue;
            previousSelection = input.selectionStart;
            return true;
        }
		function processBlur() {
			var input = this;
            if (input.value.length === 0 || input.value === "-") {
                input.value = "0";
            }
            previousSelection = -1;
        }
		function processFocus(){
			previousSelection = this.selectionStart;	
		}

    }
	
    $.fn.numericBox = function( options , parameter) {			
        for (var i = 0, len = this.length; i < len; i++) {
			if (undefined == $(this[i]).data(pluginName)) {
				var plugin = new numericBox(this[i], options);
				plugin.init();
			} else{
				var plugin = $(this[i]).data(pluginName);
				var optionType = typeof options;
				if (optionType == typeOfStr){
					if (typeof plugin[options] == typeOfFunction){
						plugin[options](parameter);
					}
				}
			}
        }

        return $(this);
    };
	
	$.fn.numericBox.defaultOptions = {
		scale: 2,
		separator: '.',
		min: 0,
		max: 100,
		//string or function can be used
		//string represent html5 data-attribute names separated by comma
		//function should have signature function($input) 
		//where $input - jQuery object of current input
		//function should return valid value - no validation check here!!		
		setup: {
			min:'nboxMin,valRangeMin',
			max:'nboxMax,valRangeMax',
			scale:'nboxScale',
			separator:'nboxSeparator',
		}
	};
	
})( jQuery );
