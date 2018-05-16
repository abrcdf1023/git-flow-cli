const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')
const {
  updateVersion
} = require('./util')

const questions = [{
  type: 'confirm',
  name: 'isResolved',
  message: 'Have you resolved the conflict?'
}]

const questions2 = [{
  name: 'commitMsg',
  message: 'Please commit...'
}]

module.exports = async function branchDone(type) {
  try {
    await execa('git', ['fetch'])

    const mergedBranch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
      .then(response => response.stdout)


    await execa('git', ['checkout', 'develop'])
    const mergeInfo = await execa('git', ['merge', mergedBranch, '--squash'])
      .then(response => response.stdout)

    console.log(chalk.cyan(mergeInfo))

    const isConflict = await execa('git', ['diff', '--diff-filter=U'])
      .then(response => response.stdout === '' ? false : true)

    if (isConflict) {
      console.log(chalk.red('You have conflict in this merge please solve it.'))
      const isResolved = await inquirer.prompt(questions).then(answers => answers.isResolved)
      if (!isResolved) {
        console.log(chalk.red("You havn't merged completely please don't push!"))
        return
      }
    }
    const commitMsg = await inquirer.prompt(questions2).then(answers => answers.commitMsg)
    await execa('git', ['commit', '-m', commitMsg])
    const newVersion = await execa('node', ['-p', 'require("./package.json").version']).then(response => updateVersion(response.stdout, type))
    const isConfirm = await inquirer.prompt([{
      type: 'confirm',
      name: 'isConfirm',
      message: `The version you want to update is ${newVersion}. Please confirm to continue...`
    }]).then(answers => answers.isConfirm)
    if (!isConfirm) {
      await execa('git', ['reset', '--hard', 'HEAD~'])
      return
    }
    await execa('npm', ['version', type])
  } catch (error) {
    console.log(chalk.red(error))
  }
}