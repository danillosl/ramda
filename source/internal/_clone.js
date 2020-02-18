import _cloneRegExp from './_cloneRegExp';
import type from '../type';

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
export default function _clone(value, deep, map) {

  map || (map = new _ObjectMap());

  // this avoids the slower switch with a quick if decision removing some milliseconds in each run.
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
    case 'Object':
      return copy({});
    case 'Array':
      return copy([]);
    case 'Date':
      return new Date(value.valueOf());
    case 'RegExp':
      return _cloneRegExp(value);
    default:
      return value;
  }
}

function _isPrimitive(param) {
  var type = typeof param;
  return param == null || (type != 'object' && type != 'function');
}

function _ObjectMap() {
  this.map = {};
  this.length = 0;
}

_ObjectMap.prototype.set = function(key, value) {
  const hashedKey = this.hash(key);

  let bucket = this.map[hashedKey];
  if (!bucket) {
    this.map[hashedKey] = bucket = [];
  }

  bucket.push([key, value]);
  this.length += 1;
};

_ObjectMap.prototype.hash = function(key) {
  let hashedKey = [];
  for (var value in key) {
    hashedKey.push(key[value]);
  }
  return hashedKey.join();
};

_ObjectMap.prototype.get = function(key) {

  /**
   * depending on the number of objects to be cloned is faster to just iterate over the items in the map just because the hash function is so costly,
   * on my tests this number is 180, anything above that using the hash function is faster.
   */
  if (this.length <= 180) {

    for (const p in this.map) {
      const bucket = this.map[p];

      for (let i = 0; i < bucket.length; i += 1) {
        const element = bucket[i];
        if (element[0] === key) {return element[1];}
      }

    }
    return;
  }

  const hashedKey = this.hash(key);
  const bucket = this.map[hashedKey];

  if (!bucket) {return;}

  for (let i = 0; i < bucket.length; i += 1) {
    const element = bucket[i];
    if (element[0] === key) {return element[1];}
  }

};

