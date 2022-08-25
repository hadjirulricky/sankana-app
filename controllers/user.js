const User = require('../models/User')

const registerUser = async (req, res) => {
    const { device_id, name, photo_url } = req.body
    if (!device_id) {
        return res.status(400).json({
            message: 'Device Id is required'
        })
    }

    if (!name) {
        return res.status(400).json({
            message: 'Name is required.'
        })
    }

    try {
        const query = User.where({ deviceId: device_id })
        const userAlreadyExists = await query.findOne()

        if (userAlreadyExists) return res.status(400).json({ message: 'User already exists.' })

        const newUser = new User({
            name: name,
            deviceId: device_id,
            photoUrl: photo_url
        })

        await newUser.save()

        res.status(200).json({
            message: 'User successfully added.',
            data: { user: newUser }
        })
    } catch (err) {
        res.status(500).send(err)
    }    
}

module.exports = { registerUser }