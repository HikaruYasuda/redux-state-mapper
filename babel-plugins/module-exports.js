'use strict';

module.exports = function (_ref) {
  var types = _ref.types;
  return {
    visitor: {
      Program: {
        exit: function exit(path) {
          if (path.BABEL_PLUGIN_MODULE_EXPORTS) {
            return;
          }

          var hasExportDefault = false;
          var exportedNames = [];
          path.get('body').forEach(function (path) {
            if (path.isExportDefaultDeclaration()) {
              hasExportDefault = true;
            } else if (path.isExportNamedDeclaration()) {
              var specifiers = path.node.specifiers;
              if (specifiers.length === 1 && specifiers[0].exported.name === 'default') {
                hasExportDefault = true;
              } else {
                exportedNames.push(specifiers[0].exported.name);
              }
            }
          });

          if (hasExportDefault) {
            path.pushContainer('body', [types.expressionStatement(types.assignmentExpression('=', types.memberExpression(types.identifier('module'), types.identifier('exports')), types.memberExpression(types.identifier('exports'), types.identifier('default'))))]);
            exportedNames.forEach(function (name) {
              path.pushContainer('body', [types.expressionStatement(types.assignmentExpression('=', types.memberExpression(types.memberExpression(types.identifier('module'), types.identifier('exports')), types.StringLiteral(name)), types.memberExpression(types.identifier('exports'), types.StringLiteral(name))))]);
            });
          }

          path.BABEL_PLUGIN_MODULE_EXPORTS = true;
        }
      }
    }
  };
};