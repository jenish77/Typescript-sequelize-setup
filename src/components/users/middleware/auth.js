const jwt = require("jsonwebtoken");
const redisClient = require('../../../redis');

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const token = bearer[1]

      const isTokenBlacklisted = await redisClient.exists(`blacklist:${token}`);
      if (isTokenBlacklisted) {
        return res.status(401).json({ error: 'Token is blacklisted' });
      }
  
      jwt.verify(token, 'QWERTYUIOP', (err, authData) => {
        if (err) {
          res.json({ message: 'Invalidate token' })
        } else {
          req.headers.user_id = authData.user_id
  
          next()
        }
      })
    } else {
      res.json({
        result: 'Tokenn is not valid',
      })
    }
  }

module.exports = verifyToken;