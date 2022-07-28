import { Router } from 'express'
import sample from '@entrypoint/sample'

const router = Router()

router.post('/sample', sample)

export default router
