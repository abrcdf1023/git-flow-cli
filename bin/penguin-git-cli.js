#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')
const version = require('../package.json').version

const {
  newBranch,
  branchDone,
} = require('../lib')

/**
 * new branch, Create a new branch/
 * branch done, Merge current branch into develop branch and update it version.
 * release, Merge develop branch into release branch and update it version.
 * product deploy, Merge release branch into master and update it version.
 * roll back latest remote commit, This is a UNSAFE option. Please use it cautiously.
 */
const defaultQuestions = [{
  type: 'list',
  name: 'gitCommand',
  message: 'Select Command ...',
  choices: ['new branch', 'branch done', 'release', 'product deploy', 'roll back latest remote commit']
}]

/**
 * bug, Create a branch with bug_ prefix.
 * feature, Create a branch with feature_ prefix.
 * refactor, Create a branch with refactor_ prefix.
 * customize, Create a branch without any prefix.
 */
const newBranchQuestions = [{
  type: 'list',
  name: 'branchType',
  message: 'Please select branch type ...',
  choices: ['bug', 'feature', 'refactor', 'customize']
}, {
  name: 'name',
  message: 'Please key in branch name'
}]

/**
 * major, ex: v1.1.0 -> v2.0.0
 * minor, ex: v1.0.1 -> v1.1.0
 * patch, ex: v1.0.0 -> v1.0.1
 */
const branchDoneQuestions = [{
  type: 'list',
  name: 'updateType',
  message: 'Please select update type ...',
  choices: ['major', 'minor', 'patch']
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
        inquirer
          .prompt(branchDoneQuestions)
          .then((answers) => {
            branchDone(answers.type)
          })
        break
      default:
        break
    }
  })