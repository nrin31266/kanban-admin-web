export interface ApiResponse <T = any> {
    code: number
    result: T
    message?: string
}

export interface PaginationResponseModel {
    currentPage: number
    totalPages: number
    pageSize: number
    totalElements: number
    data: any[]
  }