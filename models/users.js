'use strict'

const bcrypt = require('bcrypt')

class Users {
  constructor (db) {
    this.db = db
    this.ref = this.db.ref('/')
    this.collection = this.ref.child('users')
  }

  async create (data) {
    const user = {
      ...data
    }
    user.password = await this.constructor.encrypt(user.password)
    const newUser = this.collection.push()
    newUser.set(user)

    return newUser.key
  }

  async validateUser (data) {
    console.log('validateUser :: ', data)
    const userQuery = await this.collection.orderByChild('email').equalTo(data.email).once('value')
    const userFound = userQuery.val()

    console.log('userFound ::', userFound)

    if (userFound) {
      console.log('userFound :: keys ::', Object.keys(userFound)[0])
      const userId = Object.keys(userFound)[0]
      const passwdRight = await bcrypt.compare(data.password, userFound[userId].password)
      console.log('userFound :: passwdRight ::', passwdRight)
      const result = (passwdRight) ?  userFound[userId] : false

      console.log('userFound :: result ::', result)
      return result
    } else {
      return false
    }
  }

  static async encrypt (passwd) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(passwd, saltRounds)
    return hashedPassword
  }
}

module.exports = Users