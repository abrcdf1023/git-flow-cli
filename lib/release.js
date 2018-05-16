const execa = require('execa')
const chalk = require('chalk')

const {
  mergeBranch,
  startCommit,
  startSpinner,
  stopSpinner
} = require('./util')

module.exports = async function release() {
  try {
    // fetch
    startSpinner('Fetching remote repository please wait...')
    await execa('git', ['fetch'])
    stopSpinner('succeed', 'Fetch succeed.')

    // merge
    startSpinner('Merging branch please wait...')
    const mergeInfo = await mergeBranch('develop', 'release')
    stopSpinner('succeed', 'Merge succeed.')
    console.log(chalk.cyan(mergeInfo))

    // commit
    await startCommit()
    stopSpinner('succeed', 'Commit succeed.')

    console.log(chalk.cyan('Release branch is ready to push.'))
  } catch (error) {
    stopSpinner('fail', error)
  }
}
