import { NavCategory, ApiResponse } from '../type/nav'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
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
        saveData(body.categories)
        return { success: true }
    } catch (error) {
        return { success: false, error: '数据保存失败' }
    }
})
