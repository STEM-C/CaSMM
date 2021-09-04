/**
 * This file is used to store all the depreciated codes
 * still being used by our version of blockly
 */

var goog = goog || {}; //declare goog if not defined, else add to it

goog.isArray = function (a) { return "array" == goog.typeOf(a) };

goog.isString = function(val) {
    return typeof val == 'string';
};

goog.isNumber = function(val) {
return typeof val == 'number';
};

goog.isFunction = function(val) {
return goog.typeOf(val) == 'function';
};
