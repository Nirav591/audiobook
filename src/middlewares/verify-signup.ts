import { connectToDatabase } from '../config/sql.config';

export const checkUsernameOrEmail = async (req:any, res:any, next:any) => {
  const connectDatabase = await connectToDatabase();
   // Check username and email in parallel
    Promise.all([
      new Promise(async (resolve, reject) => {
        const query = 'SELECT * FROM users WHERE name = ?';
        const [results] = await connectDatabase.query(query, [req.body.name]);
        const userByUsername: any = results; 
        
          if (userByUsername) {
            return resolve(userByUsername.length > 0);
          }          
        }),
     
      new Promise(async (resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await connectDatabase.query(query, [req.body.email]);
        const userByEmail: any = results; 
        
          if (userByEmail) {
            return resolve(userByEmail.length > 0);
          }          
        }),   
    ])
      .then(([usernameInUse, emailInUse]) => {
        if (usernameInUse) {
          return res.status(400).json({ message: 'Failed! Username is already in use!' });
        }
        if (emailInUse) {
          return res.status(400).json({ message: 'Failed! Email is already in use!' });
        }
        next(); // Move to the next middleware or route handler
      })
      .catch((err) => {
        return res.status(500).json({ error: 'Database query error' });
      });
};