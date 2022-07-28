import { Request, Response } from 'express'
import HttpResponseError from '../exceptions/HttpResponseError'

export type Props<B, P, Q> = {
  body?: B
  params?: P
  query?: Q
}
export type EntrypointReturn<T> = { status: number; body: T }
export type Entrypoint<B = any, P = any, Q = any, T = any> = (
  props: Props<B, P, Q>,
) => Promise<EntrypointReturn<T>>

export async function controllerHandler<B, P, Q, T>(
  req: Request<P, T, B, Q>,
  res: Response,
  entrypoint: Entrypoint<B, P, Q>,
) {
  const props = {
    body: req.body,
    params: req.params,
    query: req.query,
  }
  try {
    let response = await entrypoint(props)
    res.status(response.status).json(response.body)
  } catch (e) {
    console.error(e)
    if (e instanceof HttpResponseError) {
      res.status(e.status).json(e.message)
      return
    }
    res.status(500).json('Erro Não Identificado')
  }
}
