const execa = require('execa')
const chalk = require('chalk')

module.exports = async function createBranch(type, name) {
  try {
    const newBranchName = `${type}_${name}`
    const checkoutBranch = type === 'hotfix' ? 'master': 'develop'
    await execa('git', ['checkout', `origin/${checkoutBranch}`])
    await execa('git', ['checkout', '-b', newBranchName])
    console.log(`${chalk.yellow(newBranchName)} created.`)
  } catch (error) {
    console.log(chalk.red(error))
  }
}
