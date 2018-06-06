const execa = require('execa')
const chalk = require('chalk')

module.exports = async function createBranch(type, name) {
  try {
    const newBranchName = `${type}_${name}`
    if (type !== 'hotfix') {
      await execa('git', ['checkout', 'origin/master'])
      await execa('git', ['checkout', '-b', newBranchName])
    } else {
      await execa('git', ['checkout', 'origin/prerelease'])
      await execa('git', ['checkout', '-b', newBranchName])
    }
    console.log(`${chalk.yellow(newBranchName)} created.`)
  } catch (error) {
    console.log(chalk.red(error))
  }
}
