export interface SupplierRequest {
  name: string
  contactPerson: string
  email: string
  slug: string
  photoUrl: string
}

export interface SupplierResponse {
  id: string
  name: string
  photoUrl: string
  slug: string
  contactPerson: string
  email: string
  createdAt: string
  updatedAt: string
}

