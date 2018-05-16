const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')

const questions = [{
  type: 'confirm',
  name: 'isResolved',
  message: 'Have you resolved the conflict?'
}]

const questions2 = [{
  name: 'commitMsg',
  message: 'Please commit...'
}]

module.exports = async function release() {
  try {
    await execa('git', ['fetch'])
    await execa('git', ['checkout', 'release'])
    const mergeInfo = await execa('git', ['merge', 'develop', '--squash'])
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
  } catch (error) {
    console.log(chalk.red(error))
  }
}