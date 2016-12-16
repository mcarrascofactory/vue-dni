'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rutValidator = rutValidator;
exports.rutFilter = rutFilter;
/* eslint-disable no-magic-numbers, max-statements */

function cleanRut(value) {
  return typeof value === 'string' ? value.replace(/[^0-9kK]+/g, '').toUpperCase() : '';
}

function rutValidator(value) {
  if (typeof value !== 'string') {
    return false;
  }

  var cleanValue = cleanRut(value);
  var t = parseInt(cleanValue.slice(0, -1), 10);
  var m = 0;
  var s = 1;

  while (t > 0) {
    s = (s + t % 10 * (9 - m++ % 6)) % 11;
    t = Math.floor(t / 10);
  }

  var v = s > 0 ? '' + (s - 1) : 'K';

  return v === cleanValue.slice(-1);
}

function rutFilter(value) {
  var cleanValue = cleanRut(value);
  var result = void 0;

  if (cleanValue.length <= 1) {
    result = cleanValue;
  } else {
    result = cleanValue.slice(-4, -1) + '-' + cleanValue.substr(cleanValue.length - 1);
    for (var i = 4; i < cleanValue.length; i += 3) {
      result = cleanValue.slice(-3 - i, -i) + '.' + result;
    }
  }

  return result;
}

var rutInputDirective = exports.rutInputDirective = {
  bind: function bind() {
    var event = this.arg === 'live' ? 'input' : 'blur';

    this.el.addEventListener(event, function (e) {
      e.target.value = rutFilter(e.target.value) || '';
    });

    this.el.addEventListener('focus', function (e) {
      e.target.value = cleanRut(e.target.value) || '';
    });
  }
};