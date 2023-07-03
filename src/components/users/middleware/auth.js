const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    console.log("bearer",bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const token = bearer[1]
  
      jwt.verify(token, 'QWERTYUIOP', (err, authData) => {
        if (err) {
          res.json({ message: 'Invalidate token' })
        } else {
          console.log('user authdata', authData)
          
          req.headers.user_id = authData.user_id
          console.log("user_id",req.headers.user_id);
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