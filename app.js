const express = require('express')
const app = express()

const userRoute = require('./routes/user')
const eventRoute = require('./routes/event')

const mongoose = require('mongoose')
const uri = 'mongodb://127.0.0.1:27017/sankana'

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })

const connection = mongoose.connection

connection.once("open", (err, db) => {
  if (err) {
    console.log(err)
  } else {
    console.log("MongoDB database connection established successfully")
  }
})

app.use(express.urlencoded({ extended : false }))
app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/event', eventRoute)

app.listen(5000, () => {
    console.log("Server is listening on port 5000.")
})
