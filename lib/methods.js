'use strict'

const questions = require('../models/index').questions

const setAnswerRight = async (questionId, answerId, user) => {
  let result
  try {
    result = await questions.setAnswerRight(questionId, answerId, user)
  } catch (error) {
    console.log('Error: setAnswerRight ::', error.message)
    return false
  }

  return result
}

const getLast = async (amount) => {
  let data
  try {
    data = await questions.getLast(amount)
  } catch (error) {
    console.error('Error :: getLast ::', error.message)
  }
  console.log('Se ejecuto :: getLast')
  return data
}

module.exports = {
  setAnswerRight,
  getLast
}