const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')

const {
  mergeBranch,
  startCommit,
  updateVersion,
  pruneTags,
  stopSpinner,
  createConfirm,
  pushRemote,
  deleteLocalBranch
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
    await pruneTags()
    // workingBranch is the branch you want merge to master
    const workingBranch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']).then((response) => response.stdout)
    console.log('🗃 ', chalk.cyan(`This branch is ${workingBranch}`))
    if (workingBranch.includes('bug_')) {
      const isConfirm = await createConfirm('Is this a bug branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      await mergeBranch(workingBranch, 'master')
      await startCommit()
      await updateVersion('patch', workingBranch)
      console.log('🎉 ', chalk.cyan('Master branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {await pushRemote()}
      const isDeleteConfirm = await createConfirm(`Do you want to delete the local ${workingBranch} branch?`)
      if (isDeleteConfirm) {deleteLocalBranch(workingBranch)}

    } else if (workingBranch.includes('feature_')) {
      const isConfirm = await createConfirm('Is this a feature branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      const updateTypeAns = await inquirer.prompt(updateTypeQs)
      await mergeBranch(workingBranch, 'master')
      await startCommit()
      await updateVersion(updateTypeAns.type, workingBranch)
      console.log('🎉 ', chalk.cyan('Master branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {await pushRemote()}
      const isDeleteConfirm = await createConfirm(`Do you want to delete the local ${workingBranch} branch?`)
      if (isDeleteConfirm) {deleteLocalBranch(workingBranch)}

    } else if (workingBranch.includes('refactor_')) {
      const isConfirm = await createConfirm('Is this a refactor branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}
      await mergeBranch(workingBranch, 'master')
      await startCommit()
      console.log('🎉 ', chalk.cyan('Master branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {await pushRemote()}
      const isDeleteConfirm = await createConfirm(`Do you want to delete the local ${workingBranch} branch?`)
      if (isDeleteConfirm) {deleteLocalBranch(workingBranch)}

    } else if (workingBranch.includes('hotfix_')) {
      const isConfirm = await createConfirm('Is this a hotfix branch?')
      if (!isConfirm) {throw (new Error('Abort.'))}

      await mergeBranch(workingBranch, 'prerelease')
      console.log('✨ ', chalk.yellow('Commit Prerelease Branch'))
      await startCommit()
      await updateVersion('hotfix', workingBranch)
      console.log('🎉 ', chalk.cyan('Prerelease branch is ready to push.'))
      const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm) {
        await pushRemote()
        console.log('🎉 ', chalk.cyan('Prerelease branch is ready to test.'))
      }

      console.log(chalk.gray('-----------------------------------'))

      await mergeBranch(workingBranch, 'master')
      console.log('✨ ', chalk.yellow('Commit Master Branch'))
      await startCommit()
      await updateVersion('patch', workingBranch)
      console.log('🎉 ', chalk.cyan('Master branch is ready to push.'))
      const isPushConfirm2 = await createConfirm('Do you want to push to remote branch?')
      if (isPushConfirm2) {await pushRemote()}

      console.log('👉 ', chalk.red("Git cli won't merge release branch automatically."))
      console.log('👉 ', chalk.red('Please create a new pull request on github manually.'))

    } else {
      console.log('👉 ', chalk.red('Unsupported branch type.'))
      console.log('👉 ', chalk.red('Supported types are bug, feature, refactor, hotfix and  in the following naming way.'))
      console.log('👉 ', chalk.red('[YOUR BRANCH TYPE]_[YOUR BRANCH NAME]'))
      console.log('👉 ', chalk.red('Or you can create branch with cli way.'))
      console.log('👉 ', chalk.red('Or you can still merge it manually.'))
      throw (new Error('Abort.'))
    }

  } catch (error) {
    stopSpinner('fail', error)
  }
}
