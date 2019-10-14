#!/usr/bin/env node
const vfile = require('to-vfile')
const findDown = require('vfile-find-down')
const processHtml = require('./process-html')
const processCss = require('./process-css')

async function process (fn, err, fileList) {
  if (err) throw err
  for (const file of fileList) {
    await fn(vfile.readSync(file))
    console.log(file.path.substring(file.cwd.length + 1))
  }
}

findDown.all('.html', process.bind(null, processHtml))
findDown.all('.css', process.bind(null, processCss))
