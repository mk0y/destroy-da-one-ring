const Koa = require('koa')
const render = require('koa-ejs')
const server = require('./server').router
const client = require('./client')
const bodyParser = require('koa-bodyparser')
const path = require('path')

const app = new Koa()

app.use(bodyParser())
app.use(client.routes()).use(client.allowedMethods())
app.use(server.routes()).use(server.allowedMethods())

render(app, {
  root: path.join(__dirname, 'public'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
})

app.use(async ctx => {
  await ctx.render('game', { movingResult: ctx.movingResult })
})

app.listen(4000)
