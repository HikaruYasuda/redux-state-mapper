'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toArray = Array.prototype.slice;

var Mapper = function () {
  function Mapper(initialState) {
    _classCallCheck(this, Mapper);

    this.cases = {};
    this.initialState = initialState;
  }

  _createClass(Mapper, [{
    key: 'reduce',
    value: function reduce(args) {
      typeof args[0] === 'undefined' && (args[0] = this.initialState);
      var fn = this.cases[args[1] ? args[1].type : ''];
      return fn ? fn.apply(this, args) : args[0];
    }
  }, {
    key: 'append',
    value: function append(args) {
      var _this = this;

      var fn = args.pop();
      if (typeof fn != 'function') throw new Error('The last argument must be a function, but it was ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
      if (args.length == 0) throw new Error('One or more of the action types is required');
      args.forEach(function (type) {
        _this.cases[type] = fn;
      });
    }
  }]);

  return Mapper;
}();

/**
 * @example
 * <pre>
 * stateMapper(initialState)
 *  .when('REQUEST_ACTION', (state, action) => ({ query: action.query }))
 *  .when('SUCCESS_ACTION', 'FAILURE_ACTION', (state, action) => ({ query: state.query, data: action.data }))
 *
 * Equivalent to:
 *
 * (state = initialState, action) => {
 *  switch (action.type) {
 *    case 'REQUEST_ACTION':
 *      return { query: action.query };
 *    case 'SUCCESS_ACTION':
 *    case 'FAILURE_ACTION':
 *      return { query: state.query, data: action.data };
 *    default:
 *      return state;
 *  }
 * }
 * </pre>
 * @param {*} initialState
 * @returns {function(state, action)|{when: function(...string, function(state, action))}}
 */


function stateMapper(initialState) {
  var mapper = new Mapper(initialState);
  /**
   * @param {*} state Previous state
   * @param {object} action Action object
   * @returns {*} Next state
   */
  function reducer(state, action) {
    return mapper.reduce(toArray.call(arguments));
  }
  reducer.when = function (actionType /* , ...actionTypes, calculator */) {
    mapper.append(toArray.call(arguments));
    return this;
  };
  return reducer;
}

exports.default = stateMapper;
