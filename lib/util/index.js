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
  return 'Merge conflict resolved'
}

module.exports.mergeBranch = async function mergeBranch(workingBranch, checkoutBranch) {
  startSpinner('Merging branch please wait...')
  await execa('git', ['checkout', checkoutBranch])
  await execa('git', ['pull'])
  let mergeInfo = await execa('git', ['merge', workingBranch, '--squash'])
    .then((response) => response.stdout)
    .catch((error) => error.stdout)

  if (mergeInfo.includes('Merge conflict')) {
    stopSpinner('fail', 'Auto-merging Fail')
    console.log(chalk.red(mergeInfo))
    mergeInfo = await _handleMergeConflict()
  } else if (mergeInfo.includes('(nothing to squash)Already up to date.')) {
    await execa('git', ['checkout', workingBranch])
    throw (new Error(mergeInfo))
  }
  stopSpinner('succeed', 'Merge succeed.')
  console.log(chalk.cyan(mergeInfo))
  return mergeInfo
}

function _updateVersion(latestVersion, type) {
  const regexp = /\d+/g
  const array = latestVersion.match(regexp)
  let major = parseInt(array[0], 10)
  let minor = parseInt(array[1], 10)
  let patch = parseInt(array[2], 10)
  let hotfix = parseInt(array[3] || 0, 10)
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
    case 'hotfix':
      hotfix += 1
      break
    default:
      break
  }
  if (type === 'hotfix') {
    return `v${major}.${minor}.${patch}-hotfix.${hotfix}`
  }
  return `v${major}.${minor}.${patch}`
}

async function checkUpdateVersion(type, workingBranch) {
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

  return newVersion
}

module.exports.checkUpdateVersion = checkUpdateVersion

module.exports.createConfirm = async function createConfirm(message) {
  const confirm = [{
    type: 'confirm',
    name: 'isConfirm',
    message
  }]
  const ans = await inquirer.prompt(confirm)
  return ans.isConfirm
}

module.exports.startCommit = async function startCommit() {
  const commitMsg = await inquirer.prompt([{
    name: 'commitMsg',
    message: 'Please commit...'
  }]).then((answers) => answers.commitMsg)

  await execa('git', ['commit', '-m', commitMsg])
  stopSpinner('succeed', 'Commit succeed.')
}

/**
 * update package version and auto commit it
 * @param {*} type the update type user pick
 * @param {*} workingBranch the branch you want merge to master
 */
module.exports.updateVersion = async function updateVersion(type, workingBranch) {
  const newVersion = await checkUpdateVersion(type, workingBranch)
  startSpinner('Updating version please wait...')
  await execa('npm', ['version', newVersion])
  await execa('git', ['add', '.'])
  await execa('git', ['commit', '-m', '"chore(version) update"'])
  stopSpinner('succeed', 'Update succeed.')
}

module.exports.pruneTags = async function pruneTags() {
  startSpinner('Pruning remote tags please wait...')
  await execa('git', ['fetch', '--prune', 'origin', '"+refs/tags/*:refs/tags/*"'])
  stopSpinner('succeed', 'Prune succeed.')
}

module.exports.pushRemote = async function pushRemote() {
  startSpinner('Pushing commit please wait...')
  await execa('git', ['push', '--follow-tags'])
  stopSpinner('succeed', 'Push succeed.')
}
