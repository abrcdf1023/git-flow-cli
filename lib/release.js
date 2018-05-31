const chalk = require('chalk')

const {
  mergeBranch,
  startCommit,
  fetchRemoteBranch,
  stopSpinner
} = require('./util')

module.exports = async function release() {
  try {
    // fetch
    fetchRemoteBranch()

    await mergeBranch('develop', 'release')
    await startCommit()

    console.log(chalk.cyan('Release branch is ready to push.'))
  } catch (error) {
    stopSpinner('fail', error)
  }
}
