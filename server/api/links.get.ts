import { readData } from '../utils/storage'

export default defineEventHandler(async () => {
    try {
        return readData()
    } catch (error) {
        console.error('Error reading data:', error)
        return {
            title: 'Desktop 导航',
            description: '您的个人桌面收藏夹',
            categories: []
        }
    }
})
