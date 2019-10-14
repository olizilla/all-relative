const path = require('path')
const toVfile = require('to-vfile')
const unified = require('unified')
const parseHtml = require('rehype-parse')
const outputHtml = require('rehype-stringify')
const findUrls = require('rehype-url-inspector')

function inspectEach ({ url, node, file }) {
  const relativePrefix = path.relative(file.dirname, file.cwd) || '.'
  if (url.match(/^\/[^/]/)) {
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

module.exports = async function (vfile) {
  const res = await processor.process(vfile)
  toVfile.writeSync(res)
}
