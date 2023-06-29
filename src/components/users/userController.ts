import { Request, Response } from "express";
import { Student } from "./models/student";

async function addStudent(req: Request, res: Response) {
  // console.log("here",req.body);
  
  try {
    const { first_name, last_name, user_name, mobile, email } = req.body;
    
    const data = await Student.create({
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      mobile: mobile,
      email: email,
    });

    return res.status(200).json({ message: 'Student profile created.' });
  } catch (error) {
    console.log("ERROR",error);
    
    return res.status(400).json({ error });
  }
}
module.exports = { addStudent }
