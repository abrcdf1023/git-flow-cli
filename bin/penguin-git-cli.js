#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const version = require('../package.json').version

const {
  newFeature
} = require('../lib')

const defaultQuestions = [{
  type: 'list',
  name: 'gitCommand',
  message: 'Select Command ...',
  choices: ['new feature', 'new bug', 'feature done', 'bug fixed', 'release', 'product deploy', 'roll back latest commit(remote)']
}]

const newFeatureQuestions = [{
  name: 'featureName',
  message: 'Please key in feature name'
}]

inquirer
  .prompt(defaultQuestions)
  .then((answers) => {
    switch (answers.gitCommand) {
      case 'new feature':
        inquirer
          .prompt(newFeatureQuestions)
          .then((answers) => {
            newFeature(answers.featureName)
          })
        break
      default:
        break
    }
  })