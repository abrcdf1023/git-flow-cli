const inquirer = require('inquirer')
const execa = require('execa')
const chalk = require('chalk')
const ora = require('ora')

const spinner = ora()

function startSpinner(msg) {
  spinner.start(` ${msg}`)
}

module.exports.startSpinner = startSpinner

function stopSpinner(type, msg) {
  switch (type) {
    case 'succeed':
      spinner.succeed(chalk.green(` ${msg}`))
      break
    case 'fail':
      spinner.fail(chalk.red(` ${msg}`))
      break
    default:
      break
  }
}

module.exports.stopSpinner = stopSpinner

async function _handleMergeConflict() {
  const isResolved = await inquirer.prompt([{
    type: 'confirm',
    name: 'isResolved',
    message: 'Have you resolved the conflict?'
  }]).then((answers) => answers.isResolved)
  if (!isResolved) {
    throw (new Error("You havn't merged completely please don't push!"))
  }
}

module.exports.mergeBranch = async function mergeBranch(workingBranch, checkoutBranch) {
  await execa('git', ['checkout', checkoutBranch])
  const mergeInfo = await execa('git', ['merge', workingBranch, '--squash'])
    .then((response) => response.stdout)
    .catch((error) => error.stdout)

  if (mergeInfo.includes('Merge conflict')) {
    stopSpinner('fail', 'Auto-merging Fail')
    console.log(chalk.red(mergeInfo))
    await _handleMergeConflict()
  } else if (mergeInfo.includes('(nothing to squash)Already up to date.')) {
    await execa('git', ['checkout', workingBranch])
    throw (new Error(mergeInfo))
  }
  return mergeInfo
}

module.exports.startCommit = async function startCommit() {
  const commitMsg = await inquirer.prompt([{
    name: 'commitMsg',
    message: 'Please commit...'
  }]).then((answers) => answers.commitMsg)

  await execa('git', ['commit', '-m', commitMsg])
}

function _updateVersion(latestVersion, type) {
  const regexp = /\d+/g
  const array = latestVersion.match(regexp)
  let major = parseInt(array[0], 10)
  let minor = parseInt(array[1], 10)
  let patch = parseInt(array[2], 10)
  switch (type) {
    case 'major':
      major += 1
      minor = 0
      patch = 0
      break
    case 'minor':
      minor += 1
      patch = 0
      break
    case 'patch':
      patch += 1
      break
    default:
      break
  }
  return `v${major}.${minor}.${patch}`
}

module.exports.checkUpdateVersion = async function checkUpdateVersion(type, workingBranch) {
  const newVersion = await execa('node', ['-p', 'require("./package.json").version'])
    .then((response) => _updateVersion(response.stdout, type))

  const isConfirm = await inquirer.prompt([{
    type: 'confirm',
    name: 'isConfirm',
    message: `The version you want to update is ${newVersion}. Please confirm to continue...`
  }]).then((answers) => answers.isConfirm)

  if (!isConfirm) {
    await execa('git', ['reset', '--hard', 'HEAD~'])
    await execa('git', ['checkout', workingBranch])
    throw (new Error('Abort.'))
  }
}
