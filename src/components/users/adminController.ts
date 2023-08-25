import { Request, Response } from "express";
import { Student } from "./models/student";
import { Admin } from "./models/Admin";
var jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';
const multer = require('multer')
const path = require('path')
const Validator = require('validatorjs')
const redisClient = require('../../redis');

async function login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
  
      const check_email = await Admin.findOne({ where: { email: email } })
  
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


  module.exports = { login }
