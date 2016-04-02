Small jQuery plugin for text input, that allow only numeric characters.

Simple usage:

$('input.numeric-input').numericBox();

Options:
  scale - maximum number of decimal places. Note: if scale set to 0 input accept only integer values.
  min/max - min/max value for input
  separator - decimal places separator
  setup - configurable setup for all options.
  
Default options can be found in $.fn.numericBox.defaultOptions object

Examples:

1) Configure global options

//remove min/max correction
$.fn.numericBox.defaultOptions.max = Infinity; 
$.fn.numericBox.defaultOptions.min = -Infinity; 

2) Setup options from html5 attributes

Html:

<input class='numeric' data-my-min-value='-40' data-another-max='60' />

JS:

var options = {
	setup : { 
		min : 'myMinValue', 
		max: 'anotherMax'
	}
}
$('.numeric').numericBox(options);

3) Remove plugin:

$('#target').numericBox('destroy');

4) Update options:

$('#target').numericBox('setOptions', {scale:4});



todo:
 add version and manifest for jQuery plugin
 format readme