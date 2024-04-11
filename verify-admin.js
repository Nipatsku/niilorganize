const jwt = require('jsonwebtoken');
const config = require('./config/database')

// Middleware that checks for valid Admin JWT bearer token
async function verifyAdmin(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.sendStatus(401) // unauthorized
    }
    try {
        const { organizer } = jwt.verify(token, config.secret)
        req.organizer = organizer
        next()
    } catch (e) {
        return res.sendStatus(401) // unauthorized
    }
}

module.exports = verifyAdmin;