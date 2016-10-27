/**
 * Check if a node is a tagged template literal
 */
const isTaggedTemplateLiteral = (node) => node.type === 'TaggedTemplateExpression'

/**
 * Check if a tagged template literal has interpolations
 */
const hasInterpolations = (node) => !node.quasi.quasis[0].tail

/**
 * Get expression name
 *
 * Returns either the variable name or something that has the same length as the interpolation
 */
const getName = (expression) => {
  // Variable passed in
  if (expression.name) return expression.name.substr(0, expression.name.length - 1)

  // Single line string passed in
  if (expression.loc && expression.loc.start.line === expression.loc.end.line) return new Array(expression.loc.end.column - expression.loc.start.column).join('a')

  // Multi line string passed in
  // TODO Fix the indentation here to not be hardcoded
  if (expression.loc) return new Array(expression.loc.end.line - expression.loc.start.line + 1).join('a\n  ')
  return undefined
}

/**
 * Merges the interpolations in a parsed tagged template literals with the strings
 *
 * TODO Fix undefined expression.name
 */
const interleave = (quasis, expressions) => (
  expressions.reduce((prev, expression, index) => (
    prev.concat(`/*${getName(expression)}*/`, quasis[index + 1].value.raw)
  ), [quasis[0].value.raw]).join('')
)

/**
 * Get the content of a tagged template literal
 *
 * TODO Cover edge cases
 */
const getTaggedTemplateLiteralContent = (node) => {
  if (hasInterpolations(node)) {
    return interleave(node.quasi.quasis, node.quasi.expressions)
  } else {
    return node.quasi.quasis[0].value.raw
  }
}

exports.isTaggedTemplateLiteral = isTaggedTemplateLiteral
exports.getTaggedTemplateLiteralContent = getTaggedTemplateLiteralContent
exports.interleave = interleave
