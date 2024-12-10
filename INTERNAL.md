
Serverless plugin for migrate
==============================
[![npm version](https://badge.fury.io/js/serverless-migrate-plugin.svg)](https://badge.fury.io/js/serverless-migrate-plugin)

This is a plugin for the [Serverless][serverless-web] framework that allows you to manage and run database-agnostic 
migrations. To do so, it works on top of [migrate][migrate-npm].

## How to release
The release will be triggered by the presence of a tag and a version bump. This is made as follows

1. Generate the new version
  ```bash
  npm version major
  ```
  or
  
  ```bash
  npm version minor
  ```
  
  or
  
  ```bash
  npm version minor
  ```
 
  or just specify the whole version (beware of not repeating it)

  ```bash
  npm version <version, e.g. 3.1.2>
  ```
This will generate a version and a tag

1. Push the commit with the correspoding tag and that will trigger the release

  ```bash
  git push origin --tags
  ```
