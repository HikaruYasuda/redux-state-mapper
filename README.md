# StateMapper for Redux

State mapper that map the action types to reducers for Redux

## Installation

`npm install --save redux-state-mapper`

## Usage

```javascript
import stateMapper from 'stateMapper'

const reducer = stateMapper(initialState)
  .when('REQUEST_ACTION', ({ data }, { query }) => ({ query, data }))
  .when('SUCCESS_ACTION', 'FAILURE_ACTION', ({ query }, { data }) => ({ query, data }))
```

This is completely equivalent to:

```javascript
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_ACTION':
      return { query: action.query, data: state.data }
    case 'SUCCESS_ACTION':
    case 'FAILURE_ACTION':
      return { query: state.query, data: action.data }
    default:
      return state
  }
}
```

## Example

```javascript
import {combineReducers} from 'redux'
import stateMapper from 'stateMapper'
import {
  CHANGE_LOGIN_PARAMS,
  SUCCESS_LOGIN,
  FAILURE_LOGIN,
  CATCH_AUTH_ERROR,
  SUCCESS_ME,
  FAILURE_ME } from './actions'

const initialUserState = {
    id: null,
    name: null,
    email: null,
}

export default combineReducers({
    token: stateMapper(null)
        .when(SUCCESS_LOGIN, (state, { token }) => token)
        .when(FAILURE_LOGIN, CATCH_AUTH_ERROR, () => null),
    params: stateMapper({})
        .when(CHANGE_LOGIN_PARAMS, (state, { params }) => params),
    error: stateMapper(null)
        .when(SUCCESS_LOGIN, () => null)
        .when(FAILURE_LOGIN, (state, { error }) => error),
    logged: stateMapper(false)
        .when(SUCCESS_LOGIN, () => true)
        .when(FAILURE_LOGIN, () => false),
    user: stateMapper(initialUserState)
        .when(SUCCESS_ME, (state, { payload }) => payload)
        .when(SUCCESS_LOGIN, (state, { user }) => user)
        .when(FAILURE_LOGIN, FAILURE_ME, () => initialUserState)
})
```

## License

MIT
