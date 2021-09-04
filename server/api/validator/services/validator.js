'use strict';

module.exports.isInt = (object) => {
  return object !== undefined && Number.isInteger(object);
};

module.exports.isPositiveInt = (object) => {
  return object !== undefined && Number.isInteger(object) && object >= 0;
};

module.exports.isIntArray = (arr) => {
  // ensure the input is an non-empty array
  if (!arr || !Array.isArray(arr) || !arr.length) return false;

  // ensure the array contains integers
  const nonIntegers = arr.filter((num) => !Number.isInteger(num));
  if (nonIntegers.length) return false;

  // passes all tests
  return true;
};
