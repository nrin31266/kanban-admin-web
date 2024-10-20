export interface ApiResponse {
    code: number
    result?: any
    message?: string
}

export interface PaginationResponseModel {
    currentPage: number
    totalPages: number
    pageSize: number
    totalElements: number
    data: any[]
  }