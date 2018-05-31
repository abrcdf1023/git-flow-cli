const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')

const {
  mergeBranch,
  startCommit,
  fetchRemoteBranch,
  stopSpinner,
  createConfirm
} = require('./util')

/**
 * major, ex: v1.1.0 -> v2.0.0
 * minor, ex: v1.0.1 -> v1.1.0
 */
const updateTypeQs = [{
  type: 'list',
  name: 'type',
  message: 'Please select update type ...',
  choices: ['major', 'minor']
}]

module.exports = async function finishBranch() {
  try {
    const workingBranch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']).then((response) => response.stdout)
    if (workingBranch.includes('bug_')) {

      const isConfirm = await createConfirm('Is this a bug branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      await fetchRemoteBranch()
      await mergeBranch(workingBranch, 'develop')
      await startCommit('patch', workingBranch)
      console.log(chalk.cyan('Develop branch is ready to push.'))

    } else if (workingBranch.includes('feature_')) {

      const isConfirm = await createConfirm('Is this a feature branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      const updateTypeAns = await inquirer.prompt(updateTypeQs)
      await fetchRemoteBranch()
      await mergeBranch(workingBranch, 'develop')
      await startCommit(updateTypeAns.type, workingBranch)
      console.log(chalk.cyan('Develop branch is ready to push.'))

    } else if (workingBranch.includes('refactor_')) {

      const isConfirm = await createConfirm('Is this a refactor branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      await fetchRemoteBranch()
      await mergeBranch(workingBranch, 'develop')
      await startCommit()
      console.log(chalk.cyan('Develop branch is ready to push.'))

    } else if (workingBranch.includes('hotfix_')) {

      const isConfirm = await createConfirm('Is this a hotfix branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      await fetchRemoteBranch()
      await mergeBranch(workingBranch, 'master')
      await startCommit('patch', workingBranch)
      await mergeBranch(workingBranch, 'develop')
      await startCommit('patch', workingBranch)
      console.log(chalk.cyan('Master and Develop branch is ready to push.'))

    } else {
      throw (new Error('Unsupport branch type. Abort.'))
    }

  } catch (error) {
    stopSpinner('fail', error)
  }
}
