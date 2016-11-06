'use strict';

/**
 * @example
 * <pre>
 * stateMapper(initialState)
 *  .when('REQUEST_ACTION', (state, action) => ({ params: action.params }))
 *  .when('SUCCESS_ACTION', 'FAILURE_ACTION', (state, action) => ({ params: state.params, data: action.data })
 *
 * equals
 *
 * (state = initialState, action) => {
 *  switch (action.type) {
 *    case 'REQUEST_ACTION':
 *      return { params: action.params };
 *    case 'SUCCESS_ACTION':
 *    case 'FAILURE_ACTION':
 *      return { params: state.params, data: action.data };
 *    default:
 *      return state;
 *  }
 * }
 * </pre>
 * @param {*} [initialState]
 * @returns {stateMapper~reducer|{when: function(...args)}}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function stateMapper(initialState) {
  var cases = {};
  /**
   * @param {*} state Previous state
   * @param {object} action Action object
   * @returns {*} Next state
   * @property {*} initialState
   * @property {Object.<string|Symbol,function(state,action)>} cases
   * @property {function(...args)} when
   */
  function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var fn = cases[action.type];
    return fn ? fn(state, action) : state;
  }
  reducer.when = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var fn = args.pop();
    if (typeof fn != 'function') throw new Error('The last argument must be a function, but it was ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)));
    if (args.length == 0) throw new Error('One or more of the action types is required');
    args.forEach(function (type) {
      cases[type] = fn;
    });
    return this;
  };
  return reducer;
}

exports.default = stateMapper;
