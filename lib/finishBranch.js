const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')

const {
  mergeBranch,
  startCommit,
  updateVersion,
  fetchRemoteBranchs,
  pruneTags,
  stopSpinner,
  createConfirm,
  pushRemote
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
    await fetchRemoteBranchs()
    await pruneTags()
    const workingBranch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']).then((response) => response.stdout)
    console.log('🗃 ', chalk.cyan(`This branch is ${workingBranch}`))
    if (workingBranch.includes('bug_')) {
      const isConfirm = await createConfirm('Is this a bug branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}

      await mergeBranch(workingBranch, 'develop')
      await startCommit()
      await updateVersion('patch', workingBranch)
      console.log('🎉 ', chalk.cyan('Develop branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {pushRemote()}

    } else if (workingBranch.includes('feature_')) {
      const isConfirm = await createConfirm('Is this a feature branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      const updateTypeAns = await inquirer.prompt(updateTypeQs)
      await mergeBranch(workingBranch, 'develop')
      await startCommit()
      await updateVersion(updateTypeAns.type, workingBranch)
      console.log('🎉 ', chalk.cyan('Develop branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {pushRemote()}

    } else if (workingBranch.includes('refactor_')) {
      const isConfirm = await createConfirm('Is this a refactor branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      await mergeBranch(workingBranch, 'develop')
      await startCommit()
      console.log('🎉 ', chalk.cyan('Develop branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {pushRemote()}

    } else if (workingBranch.includes('hotfix_')) {
      const isConfirm = await createConfirm('Is this a hotfix branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}

      await mergeBranch(workingBranch, 'release')
      console.log('✨ ', chalk.yellow('Commit Release Branch'))
      await startCommit()
      await updateVersion('hotfix', workingBranch)
      console.log('🎉 ', chalk.cyan('Release branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {
        await pushRemote()
        console.log('🎉 ', chalk.cyan('Release branch is ready to test.'))
      }

      console.log(chalk.gray('-----------------------------------'))

      await mergeBranch(workingBranch, 'develop')
      console.log('✨ ', chalk.yellow('Commit Develop Branch'))
      await startCommit()
      await updateVersion('patch', workingBranch)
      console.log('🎉 ', chalk.cyan('Develop branch is ready to push.'))
      const isPushConfirm2 = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm2) {await pushRemote()}

      console.log('👉 ', chalk.red("Git cli won't merge Master branch automatically."))
      console.log('👉 ', chalk.red('Please create a new pull request on github manually.'))

    } else {
      throw (new Error('Unsupport branch type. Abort.'))
    }

  } catch (error) {
    stopSpinner('fail', error)
  }
}
