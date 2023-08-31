import { Request, Response } from "express";
import { Student } from "./models/student";
var jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';
const multer = require('multer')
const path = require('path')
const Validator = require('validatorjs')
const redisClient = require('../../redis');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

async function register(req: Request, res: Response) {
  try {
   
  const { first_name, last_name, user_name, mobile, email, password } = req.body;

    const data_validation = {
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      mobile: mobile,
      email: email,
      password: password,
    }

    const rules = {
      first_name: 'required|string',
      last_name: 'required|string',
      user_name: 'required|string',
      mobile: [
        'required',
        'regex:/^[0-9]{10}$/',
      ],
      email: 'required|string|email',
      password: [
        'required',
        'regex:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/',
      ],
    }

    const validator = new Validator(data_validation, rules)
    if (validator.fails()) {
      let transformed:any = {}

      Object.keys(validator.errors.errors).forEach(function (key, val) {
        transformed[key] = validator.errors.errors[key][0]
      })

      const responseObject = {
        status: 'false',
        message: transformed,
      }
      return res.json(responseObject)
    }

    
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
    let OTP = Math.floor(1000 + Math.random() * 9000);
      var subject = 'Verification';
      cron.schedule("*/4 * * * *", function() {
        EmailSend(email, subject, OTP);
      });

    return res.json({ message: "User register successfully" })

  } catch (error) {
    return res.json(error)
  }
}

async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const check_email = await Student.findOne({ where: { email: email } })

    if (!check_email){
      return res.json({message:"Enter valid credentials!"})
    }
    //  throw new Error('User are not register')

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

  return res.json({status:true,data: token})

  }
  catch (err) {
    return res.json({status:false, message:"Enter valid credentials!"})
    // console.log("Catch error", err);
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


async function uploadImage(req: Request, res: Response){
  try {
    const fileStorage = multer.diskStorage({
      destination: 'uploads',
      filename: (req:any, file:any, cb:any) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)) },
      })

    const image_ = multer({
      storage: fileStorage 
    }).single("image");

    image_(req, res, async (err: any) => {
    
        if (err) return res.json( { message: 'IMAGE_NOT_UPLOADED' });
        if (!req.file) return res.json( { message: "please only image" });
        const image_name = req.file.filename;

        return res.json({
            imageName: image_name,
            imageurl:`http://localhost:3000/image/${req.file.filename}`,
            message: 'IMAGE_UPLOADED'
        });
    });

  } catch (error) {
    return res.status(500).send(error);
  }
}

async function EmailSend(email: any, subject: any, otp: any) {
  try {

      let transporter = nodemailer.createTransport({
          // service: 'gmail',
          host: 'smtp.gmail.com',//'smtp.gmail.com','smtp-relay.brevo.com'
          port: 587, // or 587 for STARTTLS
          secure: false, // use SSL/TLS
          // tls: {
          //     rejectUnauthorized: false,
          // },
          // host: "smtp.gmail.com",
          // port: 587,
          // secure: false, // use SSL
          // pool: false,
          auth: {
              user: "imesta201@gmail.com",
              pass: "ddcoapzvqmrgjsvd"
          }
      });

      // Configure the email content
      let mailOptions = {
          from: '<noreply@farhadexchange.com>',
          to: email,
          subject: subject,
          // text: `Your OTP is ${otp}`,
          html: `<div style="padding: 20px; margin: 20px; background-color: #f5f5f5;">
          <h3 style="margin-bottom: 20px;">Verification</h3>
          <p>Please enter the below code to verify.</p>
          <p style="font-size: 15px; font-weight: bold;">Your One Time Password (OTP) is: ${otp}</p>
          <p>If you have not make a request, kindly ignore this email and do not share your OTP/Password with anyone.</p>
          <p>Regards,<br>Jenish Maru.</p>
        </div>`
      };

      // Send the email with OTP
      transporter.sendMail(mailOptions, function (error: any, info: any) {
          if (error) {
              console.log('mail send error ==== ', error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
  }
  catch (error) {
    console.log("ERROR",error);
    
    // return res.status(500).send(error);
      // logger.info("EmailSend");
      // logger.info(error);
      // return commonUtils.sendError(req, res, { "message":AppStrings[req.headers.lang as string ?? 'en'].SOMETHING_WRONG});
  }
}

module.exports = { register, login, getProfile, logout, uploadImage, EmailSend }




