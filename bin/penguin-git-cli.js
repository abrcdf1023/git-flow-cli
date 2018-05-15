#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const version = require('../package.json').version

const {
  newBranch,
} = require('../lib')

const defaultQuestions = [{
  type: 'list',
  name: 'gitCommand',
  message: 'Select Command ...',
  choices: ['new branch', 'branch done', 'release', 'product deploy', '(UN_SAFE) roll back latest remote commit']
}]

const newBranchQuestions = [{
  type: 'list',
  name: 'type',
  message: 'Select Branch type ...',
  choices: ['bug', 'feature', 'refactor']
}, {
  name: 'name',
  message: 'Please key in branch name'
}]

inquirer
  .prompt(defaultQuestions)
  .then((answers) => {
    switch (answers.gitCommand) {
      case 'new branch':
        inquirer
          .prompt(newBranchQuestions)
          .then((answers) => {
            newBranch(answers.type, answers.name)
          })
        break
      case 'branch done':
        // inquirer
        //   .prompt(newBugQuestions)
        //   .then((answers) => {
        //     newBug(answers.bugName)
        //   })
        break
      default:
        break
    }
  })