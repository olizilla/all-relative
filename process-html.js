const path = require('path')
const toVfile = require('to-vfile')
const unified = require('unified')
const parseHtml = require('rehype-parse')
const outputHtml = require('rehype-stringify')
const findUrls = require('rehype-url-inspector')

function relativePath (file, url = '') {
  const relativePrefix = path.relative(file.dirname, file.cwd) || null
  return relativePrefix ? relativePrefix + url : url[0] === '/' ? url.substr(1) : url
}

function inspectEach ({ url, node, file }) {
  if (url.match(/^\/[^/]/)) {
    if (node.properties.href) {
      node.properties.href = relativePath(file, node.properties.href)
    }
    if (node.properties.src) {
      node.properties.src = relativePath(file, node.properties.src)
    }
  }
}

const processor = unified()
  .use(parseHtml)
  .use(findUrls, { inspectEach })
  .use(outputHtml)

module.exports = async function (vfile) {
  const res = await processor.process(vfile)
  toVfile.writeSync(res)
}
