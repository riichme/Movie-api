const { verifyToken} = require('../helper/userToken')
const {Movie, User} = require('../models')

async function authentication(req, res, next) {
    try {
        const {access_token} = req.headers
        if (access_token) {
            const decode = verifyToken(access_token)
            const foundUser = await User.findOne({
                where: {
                    username: decode.username
                }
            })
            if (foundUser) {
                req.loggedUser = {
                    id: decode.id,
                    username: decode.username,
                    role: decode.role,
                }
                next()
            } else {
                res.status(401).json({message: "Invalid access_token"})
            }
        } else {
            throw {status: 401, message: "Please login first"}
        }
    } catch (err) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

async function authorizationAdmin(req, res, next) {
    try {
        const {role} = req.loggedUser
        if (role === "admin") {
            next()
        } else {
            res.status(401).json({message: "Unauthorized"})
        }
    } catch(err) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

async function authorizationUser(req, res, next) {
    try {
        const {role} = req.loggedUser
        if (role === "user") {
            next()
        } else {
            res.status(401).json({message: "Unauthorized"})
        }
    } catch(err) {
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {authentication, authorizationAdmin, authorizationUser}