'user strict'

const Joi = require('joi')
const site = require('./controllers/site')
const user = require('./controllers/user')
const question = require('./controllers/question')

console.log('question ::', question)

const routes = [{
    method: 'GET',
    path: '/',
    handler: site.home,
    options: {
      cache: {
        expiresIn: 1000 * 30,
        privacy: 'private'
      }
    }
  },
  {
    method: 'GET',
    path: '/register',
    handler: site.register
  },
  {
    method: 'POST',
    options: {
      validate: {
        payload: {
          name: Joi.string().required().min(3),
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        },
        failAction: user.failValidation
      }
    },
    path: '/create-user',
    handler: user.createUser
  },
  {
    method: 'GET',
    path: '/login',
    handler: site.login
  },
  {
    method: 'GET',
    path: '/logout',
    handler: user.logoutUser
  },
  {
    method: 'GET',
    path: '/ask',
    handler: site.ask
  },
  {
    method: 'GET',
    path: '/question/{id}',
    handler: site.viewQuestion
  },
  {
    method: 'GET',
    path: '/answer/{questionId}/{answerId}',
    handler: question.setAnswerRight
  },
  {
    method: 'POST',
    options: {
      validate: {
        payload: {
          answer: Joi.string().required(),
          id: Joi.string().required()
        },
        failAction: user.failValidation
      }
    },
    path: '/answer-question',
    handler: question.answerQuestion
  },
  {
    method: 'POST',
    options: {
      validate: {
        payload: {
          title: Joi.string().required(),
          description: Joi.string().required(),
          image: Joi.any().optional()
        },
        failAction: user.failValidation
      }
    },
    path: '/create-question',
    handler: question.createQuestion
  },
  {
    method: 'POST',
    options: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        },
        failAction: user.failValidation
      }
    },
    path: '/validate-user',
    handler: user.validateUser
  },
  {
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  },
  {
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler: site.notFound
  }
]

module.exports = routes