# eGroup flow

**eGroup flow document**

## Outline

1. [Overview](#overview)
1. [Get Started](#get-started)
1. [init flow](#init-flow)
1. [create branch](#create-branch)
1. [finish current branch](#finish-current-branch)
1. [merge latest master branch into prerelease branch](#merge-latest-master-branch-into-prerelease-branch)

## Overview

eGroup flow is a flow which combine git flow and github flow and this is it diagram.

Inorder to let programmer don't need to handle with complex stuff so we create this cli interface.

## Get Started

```sh
yarn add penguin-git-cli -D
```

Or

```sh
npm i penguin-git-cli -D
```

## init flow

Create nessary prerelease and release branch from Master.

## create branch

Create a new branch, which includes following choice.

1. bug, Create a branch from master branch with bug prefix name.
1. feature, Create a branch from master branch with feature prefix name.
1. refactor, Create a branch from master branch with refactor prefix name.
1. hotfix, Create a branch from master branch with hotfix prefix name.

## finish current branch

If bug fixed or feature done which includes any version update can use this option.

Notice: Refactors will not update version. Hotfixs will merge into both master and prelease branch but with different version.The different is that master branch have the same behavior as bug branch but prelease branch add hotfix suffix.

## merge latest master branch into prerelease branch

This option is use to merge master branch into prerelease branch and it's important before you merge into release.
We highly recommend to test prerelease branch in test server before product deploy.