import { NavCategory, ApiResponse } from '../type/nav'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    // Check authentication
    const authToken = getCookie(event, 'auth_token')
    if (!authToken) {
        return { success: false, error: '未授权操作' }
    }
    
    const body = await readBody<{ categories: NavCategory[] }>(event)

    // 数据校验
    if (!body?.categories || !Array.isArray(body.categories)) {
        return { success: false, error: '无效的数据格式' }
    }

    // 分类名称唯一性校验
    const names = new Set<string>()
    for (const category of body.categories) {
        if (!category.name?.trim()) {
            return { success: false, error: `分类名称不能为空` }
        }
        if (names.has(category.name)) {
            return { success: false, error: `存在重复分类名称: ${category.name}` }
        }
        names.add(category.name)
    }

    try {
        // Read existing data to preserve title and description
        const existingData = readData()
        saveData({
            title: existingData.title,
            description: existingData.description,
            categories: body.categories
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: '数据保存失败' }
    }
})
