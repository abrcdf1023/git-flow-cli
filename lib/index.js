const path = require('path')
const execa = require('execa')
const chalk = require('chalk')

module.exports.newFeature = function newFeature(featureName) {
  console.log('new feature'+featureName)
}
