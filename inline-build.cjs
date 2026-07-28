const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, 'dist')
const assetsDir = path.join(distDir, 'assets')

let css = ''
let js = ''

fs.readdirSync(assetsDir).forEach(file => {
  const content = fs.readFileSync(path.join(assetsDir, file), 'utf-8')
  if (file.endsWith('.css')) css = content
  if (file.endsWith('.js')) js = content
})

const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#0f172a">
  <title>ENV کار</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;300;400;500;700;900&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>${js}</script>
</body>
</html>`

fs.writeFileSync(path.join(distDir, 'envkar.html'), html)
console.log('✅ Done: dist/envkar.html')
