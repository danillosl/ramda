import _cloneRegExp from "./_cloneRegExp";
import type from "../type";

/**
 * Copies an object.
 *
 * @private
 * @param {*} value The value to be copied
 * @param {Array} refFrom Array containing the source references
 * @param {Array} refTo Array containing the copied source references
 * @param {Boolean} deep Whether or not to perform deep cloning.
 * @return {*} The copied value.
 */
export default function _clone(value, deep, map = new Map()) {
  //this avoids the slower switch with a quick if decision removing some milliseconds in each run.
  if (_isPrimitive(value)) {
    return value;
  }

  var copy = function copy(copiedValue) {
    // Check for circular and same references on the object graph and return its corresponding clone.
    var cachedCopy = map.get(value);

    if (cachedCopy) {
      return cachedCopy;
    }
    map.set(value, copiedValue);

    for (var key in value) {
      copiedValue[key] = deep ? _clone(value[key], true, map) : value[key];
    }
    return copiedValue;
  };

  switch (type(value)) {
    case "Object":
      return copy({});
    case "Array":
      return copy([]);
    case "Date":
      return new Date(value.valueOf());
    case "RegExp":
      return _cloneRegExp(value);
    default:
      return value;
  }
}

function _isPrimitive(param) {
  var type = typeof param;
  return param == null || (type != "object" && type != "function");
}
