const path = require('path')
const vfile = require('to-vfile')
const unified = require('unified')
const parseHtml = require('rehype-parse')
const outputHtml = require('rehype-stringify')
const findUrls = require('rehype-url-inspector')

function inspectEach ({ url, node, file }) {
  const relativePrefix = path.relative(file.dirname, file.cwd) || '.'
  if (url.match(/^\/[^/]/)) {
    console.log(relativePrefix, node.path)
    if (node.properties.href) {
      node.properties.href = relativePrefix + node.properties.href
    }
    if (node.properties.src) {
      node.properties.src = relativePrefix + node.properties.src
    }
  }
}

const processor = unified()
  .use(parseHtml)
  .use(findUrls, { inspectEach })
  .use(outputHtml)

module.exports = function (fileInfo) {
  return new Promise((resolve, reject) => {
    processor.process(vfile.readSync(fileInfo), (err, file) => {
      if (err) return reject(err)
      vfile.writeSync(file)
      resolve()
    })
  })
}
