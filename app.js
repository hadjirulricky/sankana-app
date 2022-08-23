const express = require('express')
const app = express()

const userRoute = require('./routes/user')
const eventRoute = require('./routes/event')

app.use(express.urlencoded({ extended : false }))
app.use(express.json())

app.use('/api/user', userRoute)
app.use('/api/event', eventRoute)

app.listen(5000, () => {
    console.log("Server is listening on port 5000.")
})
