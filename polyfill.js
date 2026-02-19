// Polyfill for Array.prototype.toReversed (Node < 20)
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return this.slice().reverse();
  };
}
