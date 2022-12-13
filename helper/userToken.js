const jwt = require("jsonwebtoken")

function generateToken(user) {
    const {id, username} = user
    let access_token = jwt.sign({id, username}, process.env.SECRET)
    return access_token
}

function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET)
}

module.exports = { generateToken, verifyToken }