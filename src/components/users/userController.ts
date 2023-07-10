import { Request, Response } from "express";
import { Student } from "./models/student";
var jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';
const {redisClient }= require('../../redis')
// ================================
// const redis = require('redis');
// const redisClient = redis.createClient();

// // Connect to Redis
// redisClient.connect().then(()=> {
//   console.log("redis client is connected");
// }).catch(() => {
//   console.log("redis client is not connected");
// })
// ================================

async function register(req: Request, res: Response) {
  try {
    const { first_name, last_name, user_name, mobile, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const check_ = await Student.findOne({ where: { email: email } })
    if (check_) {
      return res.json({ message: "user already exists" })
    }

    const data = await Student.create({
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      mobile: mobile,
      email: email,
      password: hashedPassword
    })



    return res.json({ message: "User register successfully" })

  } catch (error) {
    return res.json(error)
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const check_email = await Student.findOne({ where: { email: email } })

    if (!check_email) throw new Error('User are not register')

    if (!(email && (await bcrypt.compare(password, check_email.password)))) {
      return res.json({ message: "Enter valid credentials" })
    }

    const token = jwt.sign( { user_id: check_email.id.toString() }, 'QWERTYUIOP', { expiresIn: "2h" } )

    await redisClient.set(token, 'user_id', 'EX', 3600, (err:any) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to save token',err });
      }
      res.json({ mesage:"HERE" ,err});
    });

  return res.json({token})

  }
  catch (err) {
    console.log("Catch error", err);
  }
}

async function getProfile(req: Request, res: Response) {
  try {
    const user_id = req.headers.user_id
    const token = req.headers.authorization?.split(' ')[1];
  
    const user_data = await Student.findOne({ where: { id: user_id } })

    if (user_data) {
      return res.json(user_data)
    }
    else {
      return res.json({ message: "User not found" })
    }

  } catch (error) {
    return res.json(error)
  }
}

// async function logout(req: Request, res: Response) {
//   try {
//     // const user_id = req.headers.user_id
//     const bearerHeader = req.headers['authorization']

//           const bearer = bearerHeader.split(' ')
    
//           const Logintoken = bearer[1]
//     // const client = redis.createClient(); // Create a new Redis client
//     // redisClient.get("token")
//     console.log("TOKEN",Logintoken);
    
//     await redisClient.del(Logintoken, (err: any, res: any) => {

//       if (err) {
//         return res.status(500).json({ message: 'Error deleting token' });
//       }
//       // client.quit();
//       return res.json({ message: 'Logged out successfully' });
//     })
//   } catch (error) {
//     return res.json(error)
//   }
// }
// async function logout(req: Request, res: Response) {

//       const bearerHeader = req.headers['authorization']

//       const bearer = bearerHeader.split(' ')

//       const Logintoken = bearer[1]
// console.log("TOKKNN",Logintoken);

// redisClient.del('user_id' +Logintoken , function(err:any, reply:any){
//   if(!err || reply){
//     if (err) {
//       res.json({message: err})
//     } else {
//       res.json({message:"logout"})
//     }
//       console.log("del token ");
//       // res.sendStatus(401);
//       return res.json({message:"logout"});
// }


// });
// }
// async function logout(req: Request, res: Response) {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
// console.log("Token",token);

//     await redisClient.del(token, (err: any, response: any) => {
//       if (err || response === 0) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//       res.json({ message: 'Logout successful' });
//     });
//   } catch (err) {
//     console.log("Catch error", err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }



// const logout = async(req: Request, res: Response) => {
//   const token = req.header("token")
//   if (!token) return res.status(401).send(response.error('token required'));  
//     try {
//       redisClient.set(`blacklist:${token}`, 'true', 'EX', 3600, (async(err:any) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//       }));      
//       return res.json(message: 'User logout successfully');
//     } catch (error) {
//       return res.status(403).send(err);      
//     }
// };
// =======================
const logout = async (req: Request, res: Response) => {

  const token = req.headers.authorization?.split(' ')[1];
  console.log("Token",token);
  
  if (!token) {
    return res.status(401).send({ error: 'Token required' });
  }

  try {
    await redisClient.set(`blacklist:${token}`, 'true', 'EX', 3600);
    return res.json({ message: 'User logged out successfully' });
  } catch (error) {
    return res.status(500).send(error);
  }
};





module.exports = { register, login, getProfile, logout }




