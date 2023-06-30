// const jwt = require("jsonwebtoken");

// const config = process.env;

// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token,'QWERTYUIOP');
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const token = bearer[1]
  
      // const tokennnn = req.cookies.jwt
      // console.log(tokennnn)
  
      jwt.verify(token, 'QWERTYUIOP', (err, authData) => {
        if (err) {
          res.json({ message: 'Invalidate token' + err.message })
        } else {
          console.log('user suthdata', authData)
          req.headers.userid = authData.usrId
          
  
          if (req.headers.role !== 'user') {
            return res.json({ message: 'Access denied, user must be an user' })
          } else {
            next()
          }
          // next()
        }
      })
    } else {
      res.json({
        result: 'Tokenn is not valid',
      })
    }
  }

module.exports = verifyToken;