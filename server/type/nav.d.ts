// 链接项类型
export interface NavLink {
    title: string
    url: string
    icon: string
}

// 分类类型
export interface NavCategory {
    name: string
    links: NavLink[]
}

// API 响应格式
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}

// 编辑模式类型
export type EditMode = 'create' | 'edit'
