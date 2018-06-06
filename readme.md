# git-flow-cli

**git-flow-cli document**

## Outline

1. [Overview](#overview)
1. [Get Started](#get-started)
1. [create branch](#create-branch)
1. [finish current branch](#finish-current-branch)
1. [prepare to prerelease](#prepare-to-prerelease)

## Overview

This project's main purpose is to let programmers don't need to handle with complex git stuff.

Our flow basic following the github-flow but the only difference is that we have a prerelease branch inorder to deploy to testing server.

The reason we don't deploy in develop branch is that we still have some config need modify manually.

## Get Started

```sh
yarn add @e-group/git-flow-cli -D
```

Or

```sh
npm i @e-group/git-flow-cli -D
```

## create branch

Create a new branch, which includes following choice.

1. bug, Create a branch from master branch with bug prefix name.
1. feature, Create a branch from master branch with feature prefix name.
1. refactor, Create a branch from master branch with refactor prefix name.
1. hotfix, Create a branch from master branch with hotfix prefix name.

## finish current branch

If bug fixed or feature done which includes any version update can use this option.

Notice: Refactors will not update version. Hotfixs will merge into both master and prelease branch but with different version.The different is that master branch have the same behavior as bug branch but prelease branch add hotfix suffix.

## prepare to prerelease

This option is use to merge master branch into prerelease branch.
We highly recommend deploy prerelease branch in testing server but this is totally optional.