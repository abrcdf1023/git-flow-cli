#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')

const {
  initFlow,
  createBranch,
  finishBranch,
  release
} = require('../lib')

const defaultQuestions = [{
  type: 'list',
  name: 'command',
  message: 'Select Command ...',
  choices: [
    'init flow',
    'create branch',
    'finish current branch',
    'merge latest develop branch into release branch'
  ]
}]

/**
 * bug, Create a branch from develop branch with bug prefix name.
 * feature, Create a branch from develop branch with feature prefix name.
 * refactor, Create a branch from develop branch with refactor prefix name.
 * hotfix, Create a branch from master branch with hotfix prefix name.
 */
const createBranchQs = [{
  type: 'list',
  name: 'type',
  message: "What's type of branch you want to create?",
  choices: ['bug', 'feature', 'refactor', 'hotfix']
}, {
  name: 'name',
  message: 'Please key in branch name'
}]

inquirer
  .prompt(defaultQuestions)
  .then((answers) => {
    switch (answers.command) {
      case 'init flow':
        initFlow()
        break
      case 'create branch':
        inquirer
          .prompt(createBranchQs)
          .then((createBranchAns) => {
            createBranch(createBranchAns.type, createBranchAns.name)
          })
        break
      case 'finish current branch':
        finishBranch()
        break
      case 'merge latest develop branch into release branch':
        release()
        break
      default:
        break
    }
  })
