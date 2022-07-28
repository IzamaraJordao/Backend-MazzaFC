import {
  controllerHandler,
  EntrypointReturn,
  Props,
} from '@helpers/controllerHandler'
import { HTTP_STATUS } from '@helpers/httpStatus'

type Body = {
  message: string
}
type HandlerProps = Props<Body, undefined, undefined>

async function handler(props: HandlerProps): Promise<EntrypointReturn<Body>> {
  return {
    status: HTTP_STATUS.OK,
    body: {
      message: props.body.message,
    },
  }
}

export { handler }
export default (req, res) =>
  controllerHandler<Body, undefined, undefined, Body>(req, res, handler)
