'use strict'

const { writeFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')

const questions = require('../models/index').questions
//const uuid = require('uuid/dist/v1')
const { v1: uuidv1 } = require('uuid')

const write = promisify(writeFile)

const createQuestion = async (req, h) => {
  if(!req.state.user) return h.redirect('/login')
  let result, filename
  try {
    if (Buffer.isBuffer(req.payload.image)) {
      filename = `${uuidv1()}.png`
      await write(join(__dirname, '..', 'public', 'uploads', filename), req.payload.image)
    }

    result = await questions.create(req.payload, req.state.user, filename)
    req.log('info', `Pregunta creado con el ID: ${result}`)
    //console.log(`Pregunta creado con el ID: ${result}`)
  } catch (error) {
    //console.log('Error :: createQuestion ::', error.message)
    req.log('Error', error.message)
    return h.view('ask', {
      title: 'Pregunta',
      error: 'Problemas creando la pregunta'
    }).code(500).takeover()
  }

  //return h.response(`Pregunta creado con el ID: ${result}`)
  return h.redirect(`/question/${result}`)
}

const answerQuestion = async (req, h) => {
  if(!req.state.user) return h.redirect('/login')
  let result
  try {
    result = await questions.answer(req.payload, req.state.user)
    console.log(`Respuesta creada: ${result}`)
  } catch (error) {
    console.log('Error: answerQuestion ::', error.message)
  }

  return h.redirect(`/question/${req.payload.id}`)
}

const setAnswerRight = async (req, h) => {
  if(!req.state.user) return h.redirect('/login')
  let result
  try {
    result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
  } catch (error) {
    console.log('Error: setAnswerRight :: ', error.message)
  }

  return h.redirect(`/question/${req.params.questionId}`)

}

module.exports = {
  createQuestion,
  answerQuestion,
  setAnswerRight
}