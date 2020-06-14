'use strict'

const Boom = require('boom')
const users = require('../models/index').users

const createUser = async (req, h) => {
  let result
  try {
    console.log('Try :: createUser :: data :: ', req.payload)
    result = await users.create(req.payload)
  } catch (error) {
    console.log('Error :: createUser :: ', error.message)
    return h.view('register',{
      title: 'Registro',
      error: 'Error creando el usuario'
    })
  }

  return h.view('register',{
    title: 'Registro',
    success: 'Usuario creado exitosamente.'
  })
}

const validateUser = async (req, h) => {
  let result
  try {
    result = await users.validateUser(req.payload)
    if (!result) {
      return h.view('login',{
        title: 'Login',
        error: 'Email y/o contraseña incorrecta'
      })
    }
    
    //return h.response('Email y/o contraseña incorrecta').code(401)
    // return result
  } catch (error) {
    console.log('Error :: validateUser :: ', error.message)
    //return h.response('Problemas validando el usuario.').code(500)
    return h.view('login',{
      title: 'Login',
      error: 'Problemas validando al usuario.'
    })
  }

  return h.redirect('/').state('user', {
    name: result.name,
    email: result.email
  })
}

const logoutUser = (req, h) => {
  return h.redirect('/login').unstate('user')
}

const failValidation = (req, h, err) => {
  const templates = {
    '/create-user': 'register',
    '/validate-user': 'login',
    '/create-question': 'ask'
  }

  return h.view(templates[req.path], {
    title: 'Error de Validación',
    error: 'Por favor complete los campos requeridos.'
  }).code(400).takeover()
}

module.exports = {
  createUser,
  validateUser,
  logoutUser,
  failValidation
}