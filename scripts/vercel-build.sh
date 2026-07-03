#!/usr/bin/env bash
set -euo pipefail

cd frontend
npm install
CI=false npm run build

cd ..
rm -rf public
mkdir -p public
cp -r frontend/build/. public/
