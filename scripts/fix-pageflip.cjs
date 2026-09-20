// page-flip 2.0.7 destroy() leaves its animation loop alive.
// Keep this narrow compatibility fix until upstream provides a cancellable loop.
const fs = require('node:fs')
const path = require('node:path')
const entry = require.resolve('page-flip')
const metadata = require('page-flip/package.json')
if (metadata.version !== '2.0.7') throw new Error('Review the page-flip cleanup fix before changing versions.')
let source = fs.readFileSync(entry, 'utf8')
const marker = '/* tcclola-pageflip-cleanup */'
if (!source.includes(marker)) {
  const replacements = [
    [
      'start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}',
      'start(){this.update();this.stopped=false;const t=e=>{if(this.stopped)return;this.render(e);this.frameId=requestAnimationFrame(t)};this.frameId=requestAnimationFrame(t)}stop(){this.stopped=true;cancelAnimationFrame(this.frameId)}',
    ],
    [
      'destroy(){this.ui.destroy(),this.block.remove()}',
      'destroy(){this.render.stop(),this.ui.destroy(),this.block.remove()}',
    ],
  ]
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2) throw new Error('Unexpected page-flip source: cleanup fix must be reviewed.')
    source = source.replace(before, after)
  }
  fs.writeFileSync(entry, marker + '\n' + source)
}
console.log('page-flip animation cleanup verified: ' + path.basename(entry))
