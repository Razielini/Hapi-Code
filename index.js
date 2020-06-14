'use strict'

const Hapi = require('hapi')
const handlebars = require('./lib/helpers')
const methods = require('./lib/methods')
const inert = require('inert')
const path = require('path')
const vision = require('vision')

const site = require('./controllers/site')

const routes = require('./routes')

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

const init = async () => {

  try {
    await server.register(inert)
    await server.register(vision)

    server.state('user', {
      ttl: 1000 * 60 * 60 * 24 * 7,
      isSecure: process.env.NODE_ENV == 'prod',
      encoding: 'base64json',
      path: '/'
    })

    server.views({
      engines: {
        hbs: handlebars
      },
      relativeTo: __dirname,
      path: 'views',
      layout: true,
      layoutPath: 'views'
    })

    server.ext('onPreResponse', site.fileNotFound)
    server.route(routes)
    server.method('setAnswerRight', methods.setAnswerRight)
    server.method('getLast', methods.getLast, {
      cache: {
        expiresIn: 1000 * 60,
        generateTimeout: 2000
      }
    })

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  console.log('UnhandledRejection ::', error.message, error)
})

process.on('unhandledException', error => {
  console.log('UnhandledException ::', error.message, error)
})

init()