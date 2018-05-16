const execa = require('execa')
const chalk = require('chalk')

const {
  mergeBranch,
  startCommit,
  checkUpdateVersion,
  startSpinner,
  stopSpinner
} = require('./util')

module.exports = async function branchDone(type) {
  try {
    const workingBranch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']).then((response) => response.stdout)

    // fetch
    startSpinner('Fetching remote repository please wait...')
    await execa('git', ['fetch'])
    stopSpinner('succeed', 'Fetch succeed.')

    // merge
    startSpinner('Merging branch please wait...')
    const mergeInfo = await mergeBranch(workingBranch, 'develop')
    stopSpinner('succeed', 'Merge succeed.')
    console.log(chalk.cyan(mergeInfo))

    // commit
    await startCommit()
    stopSpinner('succeed', 'Commit succeed.')

    // check update version
    await checkUpdateVersion(type, workingBranch)

    // update
    startSpinner('Updating version please wait...')
    await execa('npm', ['version', type])
    stopSpinner('succeed', 'Update succeed.')

    console.log(chalk.cyan('Develop branch is ready to push.'))
  } catch (error) {
    stopSpinner('fail', error)
  }
}
