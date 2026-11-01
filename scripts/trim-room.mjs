import sharp from 'sharp'
import fs from 'fs'

const dir = 'assets/images/room'
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.png') || f.startsWith('bigroom')) continue
  const p = `${dir}/${f}`
  const buf = await sharp(p).trim().toBuffer()
  fs.writeFileSync(p, buf)
  const { width, height } = await sharp(p).metadata()
  console.log(f, width, height)
}