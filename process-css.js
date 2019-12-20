const postcss = require('postcss')
const url = require('postcss-url')
const rel = require('relative')
const toVfile = require('to-vfile')

const isAbs = /^\/[^/]/

const processor = postcss()
  .use(url({
    url: (asset, dir) => {
      // postcss-url is very weird. It has a bug dealing with absolute urls
      // and the fitlter doenst find /^\/[^/]/... so we do it manually here
      if (!isAbs.test(asset.url)) return asset.url
      const url = rel(dir.file + '/foobar.css', process.cwd() + asset.url)
      return url
    }
  }))

module.exports = async function (vfile) {
  const res = await processor.process(vfile.toString('utf8'), {
    from: vfile.path
  })
  vfile.contents = res.css
  toVfile.writeSync(vfile)
}
