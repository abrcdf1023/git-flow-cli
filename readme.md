# penguin-git-cli

**eGroup git cli document**

## Outline

1. [Get Started](#get-started)

1. [New branch](#new-branch)
1. [Branch done](#branch-done)
1. [Release](#release)
1. [Product](#product)

## Get Started

```sh
yarn add penguin-git-cli -D
```

Or

```sh
npm i penguin-git-cli -D
```

## New branch

Create a new branch, which includes following choice.

1. bug, Create a branch with bug_ prefix.
1. feature, Create a branch with feature_ prefix.
1. refactor, Create a branch with refactor_ prefix.
1. customize, Create a branch without any prefix.

## Branch done

If bug fixed or feature done which includes any version update can use this option.

1. major, ex: v1.1.0 -> v2.0.0
1. minor, ex: v1.0.1 -> v1.1.0
1. patch, ex: v1.0.0 -> v1.0.1

## Release

This option is use to merge develop branch into release branch and it's important before you merge into master.
We highly recommend to test release branch in test server before product deploy.

## Product

Final step to deploy your product.