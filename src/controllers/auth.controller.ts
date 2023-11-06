import { Response, Request } from 'express';
import { connectToDatabase } from '../config/sql.config';
import emailValidator from 'email-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


const handleDatabaseError = (res: Response, err: Error) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

export const createUser = async (req: Request, res: Response ) => {
  try {  
    const connectDatabase = await connectToDatabase(); // Assuming connectToDatabase returns a Promise

    if (!emailValidator.validate(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, password: hash };

    const query = 'INSERT INTO users SET ?';

    try {
      const [results] = await connectDatabase.query(query, user);
      const json: any = results;  

      if (json.affectedRows === 1) {
        return res.status(200).json(user);
      } else {
        return res.status(400).json({ error: 'User not created' });
      }

      
    } catch (err:any) {
      return handleDatabaseError(res, err);
    } finally {
      await connectDatabase.end(); // Close the connection when done
    }
  } catch (err:any) {
    return handleDatabaseError(res, err);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const connectDatabase = await connectToDatabase(); // Assuming connectToDatabase returns a Promise

    const [results] = await connectDatabase.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
    const user: any = results;

      try {
        if (user.length === 0) {
          return res.status(401).json({ message: 'No such user email' });
        }

        const token = jwt.sign({ id: user[0].id }, 'secretKey', {
          algorithm: 'HS256',
          expiresIn: '24h', // 24 hours
        });

        const isPasswordValid = await bcrypt.compare(req.body.password, user[0].password);

        if (isPasswordValid) {
          const [results] = await connectDatabase.query('UPDATE users SET token = ? WHERE email = ?', [token, req.body.email]);
          const update: any = results;
          if(update.affectedRows === 1){
            return res.status(200).json({
              message: 'Login successful!',
              name: user[0].name,
              email: user[0].email,
              role: user[0].role,
              token: token,
            });
          }          
        } else {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } catch (err: any) {
        return handleDatabaseError(res, err);
      }
    }
   catch (err: any) {
    return handleDatabaseError(res, err);
  }
};

// Function to send a reset password email
const sendResetPasswordMail = async (email: string, token: string): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jayda.swift@ethereal.email',
        pass: 'xEXw96kfu7zzkFwGZd'
    }
  });

  const mailOptions = {
    from: '<jayda.swift@ethereal.email>',
    to: email,
    subject: 'Reset Password',
    html: `<p> Please copy the link and <a href="http://localhost:3000/reset-password?token=${token}">reset your password</a>.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return true;
  } catch (err) {
    console.error('Error sending email: ', err);
    return false;
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const connectDatabase = await connectToDatabase();

  const querySelect = 'SELECT * FROM users WHERE email = ?';
  const queryUpdate = 'UPDATE users SET token = ? WHERE email = ?';

  try {
    // Execute the SELECT query to find the user
    const [results] = await connectDatabase.query(querySelect, [email]);
    const user: any = results;
      try {
        if (user.length === 0) {
          return res.status(401).json({ message: 'No such user email' });
        }

        const token = jwt.sign({ email: user[0].email }, 'secret_Key');
        const sent = await sendResetPasswordMail(user[0].email, token);

        if (sent) {
          // Execute the UPDATE query to set the token
          const [results] = await connectDatabase.query(queryUpdate, [token, email]);
          const result: any = results;

            if (result.affectedRows === 1) {
              return res.status(200).json({ message: 'Please check your mailbox!' });
            } else {
              console.error('No rows were updated.');
              return res.status(400).json({ message: 'No rows were updated.' });
            }
          } else {
            return res.status(500).json({ error: 'Something went wrong while sending email.' });
          }
      } catch (err: any) {
        return handleDatabaseError(res, err);
      }
    } catch (err: any) {
    return handleDatabaseError(res, err);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;
  const connectDatabase = await connectToDatabase();

  const querySelect = 'SELECT * FROM users WHERE token = ?';
  const queryUpdate = 'UPDATE users SET password = ? WHERE email = ?';

  const [results] = await connectDatabase.query(querySelect, [token]);
  const user: any = results;
    try {
      if (user.length === 0) {
        return res.status(400).json({ message: 'Token has expired.' });
      }

      const hash = await bcrypt.hash(password, 10);
      // Execute the UPDATE query to reset password
      const [results] = await connectDatabase.query(queryUpdate, [hash, user[0].email]);
      const result: any = results;
      if(result){  
        return res.status(200).json({ message: 'User password has been reset.' });
      }
    } catch (err: any) {
      return handleDatabaseError(res, err);
    }
  };