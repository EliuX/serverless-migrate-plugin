#!/bin/bash

set -e

echo "Running basic commands"

npm run list
npm run create
npm run up --foo=foo
npm run down --foo=foo
npm run list

echo It is all good man!
