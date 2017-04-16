/**
 * Auxiliary methods
 * @type {Object}
 */
const aux = {
  /**
   * Returns the last item from the given array.
   * 
   * @param  {Array} arr
   * @return {*}
   */
  last: function (arr) {
    return arr[arr.length - 1];
  },

  /**
   * Takes in a string and parses it into an array of keys
   * 
   * @param  {String} path
   * @return {Array[String]}
   */
  parsePath: function (path) {
    var keys = path
      .replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2')
      .replace(/^\./, '')
      .split('.');

    return keys;
  }
};

function ObjectPathWalker(object, path) {

  if (!object) { throw new Error('object is required'); }
  if (!path) { throw new Error('path is required'); }

  this._path        = Array.isArray(path) ? path : aux.parsePath(path);
  this._currentPath = [];
  this._values      = [object];
}

/**
 * Static methods
 */
ObjectPathWalker.parsePath = aux.parsePath;

/**
 * Getters
 */

/**
 * Retrieves the currentKey
 * @return {String}
 */
ObjectPathWalker.prototype.currentKey = function () {
  return aux.last(this._currentPath);
};

/**
 * Retrieves a copy of the currentPath as an array of keys.
 * @return {Array[String]}
 */
ObjectPathWalker.prototype.currentPath = function () {
  return this._currentPath.concat([]);
};

/**
 * Retrieves the currentValue
 * @return {*}
 */
ObjectPathWalker.prototype.currentValue = function () {
  return aux.last(this._values);
};

/**
 * Retrieves the current depth
 * @return {Number}
 */
ObjectPathWalker.prototype.currentDepth = function () {
  return this._currentPath.length;
};

/**
 * Retrieves the next key
 * without modifying the state of the iterator.
 * 
 * @return {String}
 */
ObjectPathWalker.prototype.nextKey = function () {

  if (!this.hasNext()) {
    throw new Error('no next step');
  }

  return this._path[this._currentPath.length];
};

/**
 * Retrieves the next value
 * without modifying the state of the iterator.
 * 
 * @return {*} 
 */
ObjectPathWalker.prototype.nextValue = function () {
  var nextKey = this.nextKey();

  return this.currentValue()[nextKey];
};

/**
 * Retrieves the previous key
 * without modifying the state of the iterator.
 * 
 * @return {String}
 */
ObjectPathWalker.prototype.previousKey = function () {
  if (!this.hasPrevious()) {
    throw new Error('no previous step');
  }

  return this._path[this._currentPath.length - 2];
};

/**
 * Retrieves the previous value
 * without modifying the state of the iterator.
 * 
 * @return {*}
 */
ObjectPathWalker.prototype.previousValue = function () {
  if (!this.hasPrevious()) {
    throw new Error('no previous step');
  }

  return this._values[this._values.length - 2];
};

/**
 * Retrieves a copy of the remaining keys
 * @return {Array[String]}
 */
ObjectPathWalker.prototype.remainingPath = function () {
  return this._path.slice(this._currentPath.length);
};

/**
 * Object walking
 */

/**
 * Checks whether there is a next key.
 * @return {Boolean}
 */
ObjectPathWalker.prototype.hasNext = function () {
  return this._currentPath.length < this._path.length;
};

/**
 * Moves the current pointer to the next key, path and value.
 * 
 * @return {undefined}
 */
ObjectPathWalker.prototype.next = function () {
  if (!this.hasNext()) {
    throw new Error('no next step');
  }

  // update currentPath
  var nextKey = this._path[this._currentPath.length];
  this._currentPath.push(nextKey);

  // update currentValue
  var nextValue = this.currentValue()[nextKey];
  this._values.push(nextValue);
};

/**
 * Checks whether there is a previous key
 * @return {Boolean}
 */
ObjectPathWalker.prototype.hasPrevious = function () {
  return this._currentPath.length > 0;
};

/**
 * Moves the current pointer to the previous key, path and value
 * @return {undefined}
 */
ObjectPathWalker.prototype.previous = function () {

  if (!this.hasPrevious()) {
    throw new Error('no previous step');
  }

  // update currentPath
  this._currentPath.pop();

  // update currentValue
  this._values.pop();
};

module.exports = ObjectPathWalker;
