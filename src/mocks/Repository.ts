import { IRepository, PaginateReturnType, ParamsType } from '../models/CRUD'

type dataItem<Type> = {
  readonly [attribute in keyof Type]: Type[attribute]
}

export class RepositoryMocked<T, D> implements IRepository<T, D> {
  data: dataItem<T>[]
  constructor(data) {
    this.data = data
  }
  async getById(id: number): Promise<T> {
    // @ts-ignore
    const response = await this.data.find((item) => item.id === id)
    return response
  }
  async getBy(columnName: keyof T, data: T[typeof columnName]): Promise<T[]> {
    // @ts-ignore
    return await this.data.filter((item) => item[columnName] === data)
  }
  async update(id: number, data: Partial<D>): Promise<T> {
    // @ts-ignore
    const index = this.data.findIndex((item) => (item.id = id))
    const columns = Object.getOwnPropertyNames(data)
    columns.map((column) => {
      this.data[index][column] = data[column]
    })
    return await this.data[index]
  }
  async remove(id: number): Promise<void> {
    // @ts-ignore
    const index = this.data.findIndex((item) => (item.id = id))
    await this.data.splice(index, 1)
  }
  async paginate(params: ParamsType): Promise<PaginateReturnType<T>> {
    throw new Error('Not implemented yet')
  }
  async create(data: D): Promise<T> {
    // @ts-ignore
    this.data.push(data)
    return this.data[this.data.length - 1]
  }
}
