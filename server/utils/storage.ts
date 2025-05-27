import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'public/links.json')

// 默认数据结构
const defaultData = {
    title: 'Desktop 导航',
    description: '您的个人桌面收藏夹',
    categories: []
}

export const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    } catch (error: any) {
        console.error(`读取数据文件失败: ${dataPath}`, error)
        
        // 如果文件不存在，创建默认文件
        if (error.code === 'ENOENT') {
            try {
                saveData(defaultData)
                console.log(`创建了默认数据文件: ${dataPath}`)
                return defaultData
            } catch (writeError) {
                console.error('创建默认数据文件失败', writeError)
            }
        }
        
        // 返回默认数据
        return defaultData
    }
}

export const saveData = (data: any) => {
    try {
        // 确保目录存在
        const dir = path.dirname(dataPath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
        console.error('保存数据失败:', error)
        throw error
    }
}
