import { Request, Response } from "express";
import { Student } from "./models/student";
var jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';
const redisClient = require('../../redis');

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

const logout = async (req: Request, res: Response) => {

  const token = req.headers.authorization?.split(' ')[1];
  
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




