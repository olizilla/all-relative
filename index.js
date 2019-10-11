#!/usr/bin/env node
const findDown = require('vfile-find-down')
const processFile = require('./process')

async function readAll (err, fileList) {
  if (err) throw err
  for (const file of fileList) {
    await processFile(file)
  }
}

findDown.all('.html', readAll)
