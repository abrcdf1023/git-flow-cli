const chalk = require('chalk')

const {
  mergeBranch,
  startCommit,
  fetchRemoteBranchs,
  stopSpinner,
  createConfirm,
  pushRemote
} = require('./util')

module.exports = async function prerelease() {
  try {
    // fetch
    await fetchRemoteBranchs()

    await mergeBranch('master', 'prerelease')
    await startCommit()

    console.log(chalk.cyan('Prerelease branch is ready to push.'))
    const isPushConfirm = await createConfirm('Do you want to push to remote branch?')
    if (isPushConfirm) {pushRemote()}
  } catch (error) {
    stopSpinner('fail', error)
  }
}
