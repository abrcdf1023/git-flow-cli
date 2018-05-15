const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')

const questions = [{
  type: 'confirm',
  name: 'isCheckout',
  message: 'Do you want to checkout to the new branch?'
}]

module.exports = async function newBranch(type, name) {
  const branchName = `${type}_${name}`
  await execa('git', ['branch', branchName]).catch(e => console.log(chalk.red(e)))
  console.log(`${chalk.yellow(branchName)} created.`)
  inquirer
    .prompt(questions)
    .then((answers) => {
      if(answers.isCheckout) execa('git', ['checkout', branchName]).catch(e => console.log(chalk.red(e)))
    })
}
