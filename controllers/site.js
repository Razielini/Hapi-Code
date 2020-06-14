'use strict'

const register = (req, h) => {
  if (req.state.user) {
    return h.redirect('/')
  }

  return h.view('register', {
    title: 'Registro',
    user: req.state.user
  })
}

const login = (req, h) => {
  if (req.state.user) {
    return h.redirect('/')
  }

  return h.view('login', {
    title: 'Ingresar',
    user: req.state.user
  })
}

const viewQuestion = async (req, h) => {
  let data
  try {
    data = await questions.getOne(req.params.id)
    if (!data) {
      return notFound(req, h)
    }
  } catch (error) {
    console.log('Error :: viewQuestion ::', error.message)
  }

  console.log('Data :: ', data)

  return h.view('question', {
    title: 'Detalles de la pregunta',
    user: req.state.user,
    question: data,
    key: req.params.id
  })
}

const questions = require('../models/index').questions
const home = async (req, h) => {
  const data = await req.server.methods.getLast(10)
  /*
  console.log('Home ::')
  let data
  try {
    data = await questions.getLast(10)
  } catch (error) {
    console.log('Error: Home ::', error.message)
  }

  */
  return h.view('index', {
    title:'Home',
    user: req.state.user,
    questions: data
  })
}

const ask = (req, h) => {
  if (!req.state.user) {
    return h.redirect('/login')
  }

  return h.view('ask', {
    title: 'Crear Pregunta',
    user: req.state.user
  })
}

const notFound = (req, h) => {
  return h.view('error404', {}, {
    layout: 'error-layout'
  }).code(404)
}

const fileNotFound = (req, h) => {
  const response = req.response
  if(response.isBoom && response.output.statusCode === 404) {
    return h.view('error404', {}, {
      layout: 'error-layout'
    }).code(404)
  }

  return h.continue
}

module.exports = {
  register,
  home,
  login,
  notFound,
  fileNotFound,
  ask,
  viewQuestion
}