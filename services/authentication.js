const JWT = require("jsonwebtoken")

const secret = "KSJFOIWEHNKJNIU453254WHFNASDWFKSN79823749823"

function createTokenForUser(user){
    const payload = {
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
        createdAt:user.createdAt
    }

    const token = JWT.sign(payload,secret)
    return token
}

function validateToken(token){
    const payload = JWT.verify(token,secret)
    return payload;
}

module.exports ={
    createTokenForUser,
    validateToken
}