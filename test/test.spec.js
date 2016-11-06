var should = require('should');
var it = require('mocha').it;
var describe = require('mocha').describe;
var stateMapper = require('../index').default;
var undefined = void 0;

describe('Check initialState', function() {
  it('stateMapperは関数を返す', function() {
    should.deepEqual(typeof stateMapper(0), 'function');
  });
  it('prevStateがundefinedの時,ReducerはデフォルトでinitialStateを返す', function() {
    var prevState = undefined, action = {type: 'ACTION'};
    [
      0,
      1,
      'a initial message',
      { data: 'a data' }
    ].forEach(function(initialState) {
      var reducer = stateMapper(initialState);
      should.deepEqual(reducer(prevState, action), initialState);
    })
  });
});

describe('Check when', function() {
  it('whenの最後の引数が関数でない場合エラーになる', function() {
    should.throws(function() {
      stateMapper(0).when();
    }, Error);
    should.throws(function() {
      stateMapper(0).when('ACTION');
    }, Error);
    should.throws(function() {
      stateMapper(0).when({'call': function(){}, 'a': '1'});
    }, Error);
  });
  it('whenにアクションタイプがない場合エラーになる', function() {
    should.throws(function() {
      stateMapper(0).when(function(state, action) {
        return action.data;
      });
    }, Error)
  });
  it('アクションタイプが一致する関数が実行される', function() {
    var reducer = stateMapper('not called')
      .when('ACTION_A', 'ACTION_B', function() {
        return 'called 1';
      })
      .when('ACTION_C', 'ACTION_D', function() {
        return 'called 2'
      });
    should.equal(reducer(undefined, {type: 'ACTION_A'}), 'called 1');
    should.equal(reducer(undefined, {type: 'ACTION_B'}), 'called 1');
    should.equal(reducer(undefined, {type: 'ACTION_C'}), 'called 2');
    should.equal(reducer(undefined, {type: 'ACTION_D'}), 'called 2');
    should.equal(reducer(undefined, {type: 'ACTION_E'}), 'not called');
  });
});
