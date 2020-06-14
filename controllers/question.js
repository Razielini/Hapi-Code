'use strict'

const questions = require('../models/index').questions

const createQuestion = async (req, h) => {
  if(!req.state.user) return h.redirect('/login')
  let result
  try {
    result = await questions.create(req.payload, req.state.user)
    console.log(`Pregunta creado con el ID: ${result}`)
  } catch (error) {
    console.log('Error :: createQuestion ::', error.message)
    return history.view('ask', {
      title: 'Pregunta',
      error: 'Problemas creando la pregunta'
    }).code(500).takeover()
  }

  return h.response(`Pregunta creado con el ID: ${result}`)
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