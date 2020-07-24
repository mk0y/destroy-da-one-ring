const Router = require('@koa/router')
const axios = require('axios').default
const R = require('ramda')
const router = new Router()

const getServerResponse = async ({ client, data }) => {
  const response = await client('http://localhost:4000/server', data)
  return R.path(['data'], response)
}

const post = async (ctx, next) => {
  const moves = R.path(['request', 'body', 'moves'])(ctx)
  const movingResult = await getServerResponse({ client: axios.post, data: { moves } })
  ctx.movingResult = movingResult
  await next()
}

router.post('/', post)

module.exports = router
