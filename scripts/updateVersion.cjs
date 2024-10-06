const fs = require("fs")
const path = require("path")

const packageJsonPath = path.join(process.cwd(), "package.json")
const tauriProdConfigPath = path.join(process.cwd(), "src-tauri", "tauri.conf.prod.json")
const tauriConfigPath = path.join(process.cwd(), "src-tauri", "tauri.conf.json")

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const newVersion = packageJson.version

const tauriProdConfig = JSON.parse(fs.readFileSync(tauriProdConfigPath, "utf8"))
const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, "utf8"))

tauriProdConfig.version = newVersion
tauriConfig.version = newVersion

fs.writeFileSync(tauriProdConfigPath, JSON.stringify(tauriProdConfig, null, 2), "utf8")
fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2), "utf8")

console.log(`Updated version to ${newVersion} in tauri.conf.prod.json`)
