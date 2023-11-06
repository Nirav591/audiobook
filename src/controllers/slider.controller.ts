import { Response, Request } from 'express';
import { connectToDatabase } from '../config/sql.config';

const handleDatabaseError = (res: Response, err: Error) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

export const createSlider = async (req: Request, res: Response ) => {
  try {  
    const connectDatabase = await connectToDatabase(); // Assuming connectToDatabase returns a Promise
    const { title, description } = req.body;
    let query = 'INSERT INTO slider (title, description) VALUES (?, ?)';
    const queryParams = [title, description];

    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.push(imageFilePath);
      query = 'INSERT INTO slider (title, description, image) VALUES (?, ?, ?)';
    }

    try {
      const [results] = await connectDatabase.query(query, queryParams);
      const json: any = results;  

      if (json.affectedRows === 1) {
        return res.status(200).json({message: 'Slider created successfully!'});
      } else {
        return res.status(400).json({ error: 'Slider not created' });
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

export const getSlider = async (req: Request, res: Response ) => {
  const connectDatabase = await connectToDatabase();
  try{   
    const query = 'SELECT * FROM slider';
    const [results] = await connectDatabase.query(query);
    const json: any = results; 
      if(json){
        return res.status(200).json(json);        
      }
  } catch(err:any) {
    return handleDatabaseError(res, err);
  }
}