Small jQuery plugin for text input, that allow only numeric characters.

Simple usage:

$('input.numeric-input').numericBox();

Options:
  scale - maximum number of decimal places. Note: if scale set to 0 textbox accept only integer values.
  max - max value for textbox
  min - min value for textbox
  separator - decimal places separator

todo:
 refactor options
 allow not entering min & max
 not allow minus sign if option.min >= 0
 add version and manifest for jQuery plugin