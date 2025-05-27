import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'public/links.json')

export const readData = () => {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

export const saveData = (data: any) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
