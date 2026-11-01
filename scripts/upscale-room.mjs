import sharp from 'sharp'
import fs from 'fs'

const dir = 'assets/images/room'
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith('bigroom') || !f.endsWith('.png')) continue
  const p = `${dir}/${f}`
  const { width } = await sharp(p).metadata()
  if (width > 256) { console.log(f, 'skipped (already big)'); continue }
  const out = await sharp(p).resize(width * 8, null, { kernel: 'nearest' }).png().toBuffer()
  fs.writeFileSync(p, out)
  console.log(f, width, '→', width * 8)
}