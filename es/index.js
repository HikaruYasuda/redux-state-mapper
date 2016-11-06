'use strict'

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
function stateMapper(initialState) {
  const cases = {}
  /**
   * @param {*} state Previous state
   * @param {object} action Action object
   * @returns {*} Next state
   * @property {*} initialState
   * @property {Object.<string|Symbol,function(state,action)>} cases
   * @property {function(...args)} when
   */
  function reducer(state = initialState, action) {
    const fn = cases[action.type]
    return fn ? fn(state, action) : state
  }
  reducer.when = function(...args) {
    const fn = args.pop()
    if (typeof fn != 'function') throw new Error(`The last argument must be a function, but it was ${typeof fn}`)
    if (args.length == 0) throw new Error('One or more of the action types is required')
    args.forEach(type => {
      cases[type] = fn
    })
    return this
  }
  return reducer
}

export default stateMapper
