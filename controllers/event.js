const createEvent = (req, res) => {
    res.send('Create Event')
}

const joinEvent = (req, res) => {
    res.send('Join Event')
}

const completeEvent = (req, res) => {
    res.send('Complete Event')
}

const getEvent = (req, res) => {
    res.send('Get Event')
}

module.exports = {
    createEvent,
    joinEvent,
    completeEvent,
    getEvent
}