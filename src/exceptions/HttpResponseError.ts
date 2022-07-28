class HttpResponseError extends Error {
  status: number
  constructor({ status = 500, message = '' }) {
    super(message)
    this.name = 'HttpResponseError'
    this.status = status
  }
  response(merge = {}) {
    return {
      ...merge,
      type: this.name,
      status: this.status,
      message: this.message,
    }
  }
}

export default <any>HttpResponseError
