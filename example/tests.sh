#!/bin/bash

set -e

echo "Running basic commands"

npm run list
npm run create
npm run up
npm run down
npm run list

echo "Every seems Ok!"
