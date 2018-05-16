const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')

const {
  updateVersion
} = require('./util')

const spinner = ora()

module.exports = async function branchDone(type) {
  try {
    // step 1
    spinner.start(' Fetching remote repository please wait...')

    await execa('git', ['fetch']).catch((e) => {
      throw (new Error(e))
    })

    spinner.succeed(' Fetch success.')

    // step 2
    spinner.start(' Merging branch please wait...')

    const mergedBranch = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
      .then(response => response.stdout)
      .catch((e) => {
        throw (new Error(e))
      })

    await execa('git', ['checkout', 'develop']).catch((e) => {
      throw (new Error(e))
    })

    const mergeInfo = await execa('git', ['merge', mergedBranch, '--squash'])
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

    spinner.succeed(' Commit success.')

    // step 4
    const newVersion = await execa('node', ['-p', 'require("./package.json").version'])
      .then(response => updateVersion(response.stdout, type))
      .catch((e) => {
        throw (new Error(e))
      })

    const isConfirm = await inquirer.prompt([{
      type: 'confirm',
      name: 'isConfirm',
      message: `The version you want to update is ${newVersion}. Please confirm to continue...`
    }]).then(answers => answers.isConfirm)

    if (!isConfirm) {
      await execa('git', ['reset', '--hard', 'HEAD~']).catch((e) => {
        throw (new Error(e))
      })
      throw (new Error("Abort."))
    }

    spinner.start(' Updating version please wait...')

    await execa('npm', ['version', type]).catch((e) => {
      throw (new Error(e))
    })

    spinner.succeed(' Update success this branch is ready to push.')
  } catch (error) {
    spinner.fail(error)
  }
}