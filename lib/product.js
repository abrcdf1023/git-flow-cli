const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')

const spinner = ora()

module.exports = async function product() {
  try {
    // step 1
    spinner.start(' Fetching remote repository please wait...')

    await execa('git', ['fetch']).catch((e) => {
      throw (new Error(e))
    })

    spinner.succeed(' Fetch success.')

    // step 2
    spinner.start(' Merging branch please wait...')

    await execa('git', ['checkout', 'master']).catch((e) => {
      throw (new Error(e))
    })

    const mergeInfo = await execa('git', ['merge', 'release', '--squash'])
      .then(response => response.stdout)
      .catch((e) => {
        throw (new Error(e))
      })

    if (mergeInfo.includes('(nothing to squash)Already up to date.')) throw (new Error(mergeInfo))

    const isConflict = await execa('git', ['diff', '--diff-filter=U'])
      .then(response => response.stdout === '' ? false : true)
      .catch((e) => {
        throw (new Error(e))
      })

    if (isConflict) {
      console.log(chalk.red('You have conflict in this merge please solve it.'))
      const isResolved = await inquirer.prompt([{
        type: 'confirm',
        name: 'isResolved',
        message: 'Have you resolved the conflict?'
      }]).then(answers => answers.isResolved)
      if (!isResolved) {
        throw (new Error("You havn't merged completely please don't push!"))
      }
    }

    spinner.succeed(' Merge success.')
    console.log(chalk.cyan(mergeInfo))

    // step 3
    const commitMsg = await inquirer.prompt([{
      name: 'commitMsg',
      message: 'Please commit...'
    }]).then(answers => answers.commitMsg)

    spinner.start(' Commiting please wait...')

    await execa('git', ['commit', '-m', commitMsg]).catch((e) => {
      throw (new Error(e))
    })

    spinner.succeed(' Commit success this branch is ready to push.')
  } catch (error) {
    spinner.fail(error)
  }
}