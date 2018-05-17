#!/usr/bin/env node

'use strict'

const inquirer = require('inquirer')

const {
  newBranch,
  branchDone,
  release,
  product
} = require('../lib')

/**
 * new branch, Create a new branch/
 * branch done, Merge current branch into develop branch and update it version.
 * release, Merge latest develop branch into release branch.
 * product, Merge latest release branch into master.
 */
const defaultQuestions = [{
  type: 'list',
  name: 'command',
  message: 'Select Command ...',
  choices: ['new branch', 'branch done', 'release', 'product']
}]

/**
 * bug, Create a branch with bug_ prefix.
 * feature, Create a branch with feature_ prefix.
 * refactor, Create a branch with refactor_ prefix.
 * customize, Create a branch without any prefix.
 */
const questions = [{
  type: 'list',
  name: 'type',
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
const questions2 = [{
  type: 'list',
  name: 'type',
  message: 'Please select update type ...',
  choices: ['major', 'minor', 'patch']
}]

const questions3 = [{
  type: 'confirm',
  name: 'isConfirm',
  message: 'Do you want to merge latest develop branch into release branch?'
}]

const questions4 = [{
  type: 'confirm',
  name: 'isConfirm',
  message: 'Do you want to merge latest release branch into master?'
}]

inquirer
  .prompt(defaultQuestions)
  .then((answers) => {
    switch (answers.command) {
      case 'new branch':
        inquirer
          .prompt(questions)
          .then((answers) => {
            newBranch(answers.type, answers.name)
          })
        break
      case 'branch done':
        inquirer
          .prompt(questions2)
          .then((answers) => {
            branchDone(answers.type)
          })
        break
      case 'release':
        inquirer
          .prompt(questions3)
          .then((answers) => {
            if (answers.isConfirm) {release()}
          })
        break
      case 'product':
        inquirer
          .prompt(questions4)
          .then((answers) => {
            if (answers.isConfirm) {product()}
          })
        break
      default:
        break
    }
  })
