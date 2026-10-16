// Publie dist/ sur la branche gh-pages (GitHub Pages) : npm run deploy
import { execSync } from 'node:child_process'
import { copyFileSync, writeFileSync, rmSync, mkdtempSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const run = (c, cwd) => execSync(c, { stdio: 'inherit', cwd })
run('npm run build')
copyFileSync('dist/index.html', 'dist/404.html') // adresses profondes -> application monopage
writeFileSync('dist/.nojekyll', '')
const remote = execSync('git remote get-url origin').toString().trim()
const name = execSync('git log -1 --format=%an').toString().trim()
const email = execSync('git log -1 --format=%ae').toString().trim()
const dir = mkdtempSync(join(tmpdir(), 'ghp-'))
cpSync('dist', dir, { recursive: true })
run('git init -q -b gh-pages', dir)
run('git add -A', dir)
run(`git -c user.name="${name}" -c user.email="${email}" commit -q -m "Publication du site"`, dir)
run(`git push -q -f ${remote} gh-pages`, dir)
rmSync(dir, { recursive: true, force: true })
console.log('Publié : https://guillaumegabourg.github.io/yourteco/')
