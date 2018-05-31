const execa = require('execa')
const chalk = require('chalk')

module.exports = async function initFlow(type, name) {
  try {
    await execa('git', ['checkout', `origin/master`])
    await execa('git', ['checkout', '-b', 'release'])

    await execa('git', ['checkout', `origin/master`])
    await execa('git', ['checkout', '-b', 'develop'])
  } catch (error) {
    console.log(chalk.red(error))
  }
}
