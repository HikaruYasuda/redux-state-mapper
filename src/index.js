'use strict'

const toArray = Array.prototype.slice

class Mapper {
  constructor(initialState) {
    this.cases = {}
    this.initialState = initialState
  }
  reduce(args) {
    typeof args[0] === 'undefined' && (args[0] = this.initialState)
    const fn = this.cases[(args[1] && args[1].type) || '']
    return fn ? fn.apply(this, args) : args[0]
  }
  append(args) {
    const fn = args.pop()
    if (typeof fn != 'function') throw new Error(`The last argument must be a function, but it was ${typeof fn}`)
    if (args.length == 0) throw new Error('One or more of the action types is required')
    args.forEach(type => {
      this.cases[type] = fn
    })
  }
}

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
  const mapper = new Mapper(initialState)
  /**
   * @param {*} state Previous state
   * @param {object} action Action object
   * @returns {*} Next state
   */
  function reducer(state, action) {
    return mapper.reduce(toArray.call(arguments))
  }
  reducer.when = function(actionType/* , ...actionTypes, calculator */) {
    mapper.append(toArray.call(arguments))
    return this
  }
  return reducer
}

export default stateMapper
