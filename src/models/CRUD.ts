export interface IRepository<T, D> {
  getById: (id: number) => Promise<T>
  getBy: (columnName: keyof T, data: T[typeof columnName]) => Promise<T[]>
  update: (id: number, data: Partial<D>) => Promise<T>
  remove: (id: number) => Promise<void>
  paginate: (params: ParamsType) => Promise<PaginateReturnType<T>>
  create: (data: D) => Promise<T>
}

export type Pagination<Filter> = {
  pageSize: number
  filter?: Filter | string
  order?: Order
  page?: number
  search?: Search
}
export type Order = {
  names: string[]
  order: 'DESC' | ''
}

export type Search = {
  name: string
  search: string
}

export type PaginateReturnType<T> = {
  results: T[]
  total: number
  pageSize: number
  current: number
  lastPage: number
  filter?: string
}

export type ParamsType = {
  page?: string
  pageSize?: number
  filter: string
  order: string
}

export class ModelRepository<T, D> implements IRepository<T, D> {
  private readonly model: any
  private idName: keyof T
  constructor(model: string, idName: keyof T) {
    this.model = model
    this.idName = idName
  }

  async create(data: D): Promise<T> {
    return await this.model.query().insert(data)
  }
  async getById(id: number): Promise<T> {
    return await this.model.query().where(this.idName, id).first()
  }
  async getBy(columnName: keyof T, data: any): Promise<T[]> {
    switch (typeof data) {
      case 'string':
        return this.model
          .query()
          .whereRaw('LOWER(??) like LOWER(?)', [columnName, `%${data}%`])
      case 'number':
      default:
        return this.model.query().where(columnName, data)
    }
  }
  async update(id: number, data: Partial<D>): Promise<T> {
    return await this.model.query().where(this.idName, id).update(data)
  }
  async remove(id: number): Promise<void> {
    await this.model.query().where(this.idName, id).del()
  }
  async paginate(
    params: ParamsType,
    trx: any = null,
  ): Promise<PaginateReturnType<T>> {
    const current = +(Number(params?.page) || 1)
    const pageSize = Number(params?.pageSize || 10)
    const filters = params.filter ? JSON.parse(params.filter) : undefined
    const order = JSON.parse(params?.order || '{}')
    const query = this.model.query(trx)

    const queryWithFilters = query.where((q) => getFilters<T>(q, filters))
    const queryWithOrder = order.field
      ? queryWithFilters.orderBy(order.field, order.order)
      : queryWithFilters.orderBy(this.model.ref(this.idName), 'desc')

    const pager = await queryWithOrder.page(current - 1, Number(pageSize) || 10)

    pager.pageSize = Number(pageSize)
    pager.current = current

    pager.lastPage = Math.ceil(pager.total / pageSize)

    if (pageSize < 0) {
      return {
        results: [...pager],
        total: pager.length,
        pageSize,
        current: 1,
        lastPage: 1,
      }
    }

    return pager
  }
}

export function getFilters<T>(query: any, filters: Partial<T> | undefined) {
  if (filters == undefined) return

  const filter = !!filters ? filters : null
  console.log('Filter!!', filter)

  const filterNames = Object.getOwnPropertyNames(filter)

  filterNames.map((name) => {
    switch (typeof filter[name]) {
      case 'string':
        if (!isNaN(filter[name])) {
          query = query.where(name, filter[name])
          return
        }
        query = query.whereRaw('LOWER(?) like LOWER(?)', [
          name,
          `%${filter[name]}%`,
        ])
        return
      case 'number':
      default:
        query = query.where(name, filter[name])
        return
    }
  })

  return query
}
