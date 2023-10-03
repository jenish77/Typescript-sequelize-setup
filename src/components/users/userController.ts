import { Request, Response } from "express";
import { Student } from "./models/student";
import { Category } from "./models/category";
import { Text } from "./models/text";

var jwt = require('jsonwebtoken');
import bcrypt from 'bcryptjs';
import multer, {FileFilterCallback} from 'multer'
const path = require('path')
const Validator = require('validatorjs')
const redisClient = require('../../redis');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const sharp = require('sharp');
const Stripe_key = "sk_test_51NvaMuBhSobiWFQoc49L6U8jstFeQdMfs5Nc1PzOVt7riF7IZHZ6YE2qqMOpNwSLdbPg0U2WU6HZ4pGI7ZoY65nK00JwGNXrtg"
const stripe = require("stripe")(Stripe_key)
const ffmpeg = require('fluent-ffmpeg'); // Import the fluent-ffmpeg library
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
const fs = require('fs');

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
    // let OTP = Math.floor(1000 + Math.random() * 9000);
    //   var subject = 'Verification';
    //   cron.schedule("*/4 * * * *", function() {
    //     EmailSend(email, subject, OTP);
    //   });

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

async function getAllProfile(req: Request, res: Response) {
  try {
    const user_id = req.headers.user_id
    const token = req.headers.authorization?.split(' ')[1];
  
    const user_data = await Student.findAll()

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

async function uploadVideo(req: Request, res: Response) {
  try {
    const fileStorage = multer.diskStorage({
      destination: 'uploads',
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
      }
    });

    const fileFilter = (request:any, file:any, callback:any) => {
      if (file.mimetype.startsWith('video/')) {
        callback(null, true);
      } else {
        callback(new Error('Upload only videos'), false);
      }
    };

    const upload = multer({
      storage: fileStorage,
      fileFilter: fileFilter
    }).single("video");

    upload(req, res, async (err) => {
      if (err) return res.json({ message: 'upload only videos' });
      if (!req.file) return res.json({ message: "VIDEO_NOT_UPLOADED" });

      const video_name = req.file.filename;

      const inputPath = path.join('uploads', video_name);
      const outputPath = path.join('uploads', 'compressed_' + video_name);

      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-b:v 500k',
          '-b:a 128k'
        ])
        .on('end', async () => {
          return res.json({
            videoName: 'compressed_' + video_name,
            videoUrl: `http://localhost:3001/image/compressed_${video_name}`,
            message: 'VIDEO_UPLOADED'
          });
        })
        .on('error', (err:any) => {
          console.error('Error during video compression:', err);
          return res.json({ message: 'Error during video compression' });
        })
        .run();
    });

  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
}



async function uploadPdf(req: Request, res: Response) {
  try {
    const fileStorage = multer.diskStorage({
      destination: 'uploads',
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
      }
    });

    const fileFilter = (request:any, file:any, callback:any) => {
      if (file.mimetype === 'application/pdf') {
        callback(null, true); // Accept the file
      } else {
        callback(new Error('Upload only PDFs'), false); // Reject the file
      }
    };

    const pdf_ = multer({
      storage: fileStorage,
      fileFilter: fileFilter
    }).single("pdf");

    pdf_(req, res, async (err) => {
      if (err) return res.json({ message: 'upload only PDF' });
      if (!req.file) return res.json({ message: "PDF_NOT_UPLOADED" });

      const pdf_name = req.file.filename;

      return res.json({
        pdfName:  pdf_name,
        pdfUrl: `http://localhost:3001/image/${pdf_name}`,
        message: 'PDF_UPLOADED'
      });
    });

  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
}

// async function uploadPdf(req: Request, res: Response) {
//   try {
//     const fileStorage = multer.diskStorage({
//       destination: 'uploads',
//       filename: (req: any, file: any, cb: any) => {
//         cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
//       }
//     });

//     const fileFilter = (request: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
//       if (
//         file.mimetype === 'application/pdf'
//       ) {
//         callback(null, true); // Accept the file
//       } else {
//         callback(new Error('Upload only PDFs'), false); // Reject the file
//       }
//     };

//     const pdf_ = multer({
//       storage: fileStorage,
//       fileFilter: fileFilter
//     }).single("pdf");

//     pdf_(req, res, async (err) => {
//       if (err) return res.json({ message: 'upload only PDF' });
//       if (!req.file) return res.json({ message: "PDF_NOT_UPLOADED" });

//         const pdf_name = req.file.filename;

//             return res.json({
//               pdfName: pdf_name,
//               pdfUrl: `http://localhost:3001/image/${pdf_name}`,
//               message: 'PDF_UPLOADED'
//             });
//           });

//       } catch (error) {
//         console.log(error)
//         return res.json({error });
//       }

// }

async function uploadImage(req: Request, res: Response){
  try {
    const fileStorage = multer.diskStorage({
      destination: 'uploads',
      filename: (req:any, file:any, cb:any) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)) },
      })

      const fileFilter = (request: Request,file: Express.Multer.File,callback: (error: Error | null, acceptFile: boolean)=> void) => {
        // Check if the file is an image   
        if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg') {
          callback(null, true); // Accept the file
        } else { 
          callback(new Error('Upload only images'), false); // Reject the file
        }
      };  

    const image_ = multer({
      storage: fileStorage,
      fileFilter: fileFilter,
      // limits: {
      //   fileSize: 1024 * 1024 * 2 // 5 MB (adjust as needed)
      // } 
    }).single("image");

    image_(req, res, async (err: any) => {
      // if (err) return res.json({ message: err });
      // if (err) return res.json({ message: 'File too large' });
      if (err) return res.json({message: 'upload only image' });
      if (!req.file) return res.json({ message: "IMAGE_NOT_UPLOADED" });
    
      const imageBuffer = await sharp(req.file.path)
          .resize({ width: 800, height: 600 })
          .toBuffer();
    
      fs.writeFile(req.file.path, imageBuffer, (err:any) => {
        if (err) return res.json({ message: 'Error compressing image' });
    
        const image_name = req.file.filename;
    
        return res.json({
          imageName: image_name,
          imageurl: `http://localhost:3001/image/${req.file.filename}`,
          message: 'IMAGE_UPLOADED'
        });
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

async function addCategory(req: Request, res: Response) {
  try {
    const { category_name, image } = req.body
    const add_category = await Category.create({ category_name:category_name, image:image })
    return res.json({ message: "Category added successfully" })

  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

async function showCategory(req: Request, res: Response) {
  try {
    const all_category = await Category.findAll({})
    return res.json(all_category)
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}
async function showCategoryById(req: Request, res: Response) {
  try {
    const id = Number(req.query.id); 
    const all_category = await Category.findOne({where: {id: id}})
    return res.json(all_category)
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

async function editCategory(req: Request, res: Response){
  try {
    const { id, category_name } = req.body; 

    // Find the category by its ID
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update the category_name
    await category.update({ category_name });

    return res.json({ message:"Category added successfully" });
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

async function deleteCategory(req: Request, res: Response) {
  try {
    const id:any = req.headers.id;
    
    await Category.destroy({where: {id: id}})
    return res.json({ message:"Category deleted successfully" }); 
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

async function addText(req: Request, res: Response) {
  try {
    const { text, category_id } = req.body
    const add_text = await Text.create({ text:text, category_id:category_id })
    return res.json({ message: "Text added successfully" })
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

async function getTextById(req: Request, res: Response){
  try {
    const id = Number(req.query.id); 
    const get_text = await Text.findAll({where:{category_id:id}})
    return res.json({ get_text })
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

async function createNewCustomer(req: Request, res: Response){
  try {
    const customer = await stripe.customers.create({
      name:req.body.name,
      email:req.body.email 
    })
    return res.json({ customer })
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

// async function addNewCard(req: Request, res: Response) {
//   try {
//     console.log('body',req.body);
    
//     const { customer_id, card_name, card_expyear, card_expmonth, card_number, card_cvc} = req.body
//     const card_token = await stripe.tokens.create({
//       card: {
//         // name: card_name,
//         number: card_number,
//         exp_month: card_expmonth,
//         exp_year: card_expyear,
//         cvc: card_cvc
//       }
//     });  
      

//     const card = await stripe.customers.createSource(customer_id, {
//       source: `${card_token.id}`
//     });

//     return res.json({ card: card.id });

//   } catch (error) {
//     console.log("MOTI ERROR",error);
//     return res.json(error)
//   }
// }
async function addNewCard(req: Request, res: Response) {
  try {
    const { customer_id, card_name, card_expyear, card_expmonth, card_number, card_cvc, card_token } = req.body;

    const card = await stripe.customers.createSource(customer_id, {
      source: card_token
    });

    return res.json({ card: card.id });
  } catch (error) {
    console.log("Error adding card:", error);
    return res.json(error);
  }
}

async function charges(req: Request, res: Response){
  try {
    const { amount, currency, source, description } = req.body;

    const charge = await stripe.charges.create({
      amount: amount*100,
      currency: currency,
      source: source,
      description: description 
    })

    return res.json({ "message":charge.receipt_url });

  } catch (error) {
    console.log("Error adding card:", error);
    return res.json(error);
  }
}

async function sendSMS(req: Request, res: Response){
  const accountSid = 'ACed54d058557027bfc2e124f2faa49632';
  const authToken = 'a70632f4216d3654e23efb3231707ae3';
  const { message,phone } = req.body
  try {
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
       body: message,
       from: '+16179368206',
       to: phone
     })
     return res.json({ "message":"message send successfull." });
  } 
catch (error) {
    console.log(error);
    return res.json(error)
  }
}

module.exports = { 
  register,
  login,
  addCategory,
  showCategory,
  editCategory,
  getProfile,
  logout,
  uploadImage,
  uploadPdf,
  uploadVideo,
  EmailSend,
  getAllProfile,
  deleteCategory,
  showCategoryById,
  getTextById,
  createNewCustomer,
  addNewCard,
  charges,
  sendSMS,
  addText
}




