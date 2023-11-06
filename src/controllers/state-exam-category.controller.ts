import { Response, Request } from 'express';
import { connectToDatabase } from '../config/sql.config';

const handleDatabaseError = (res: Response, err: Error) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};
// State exam name, image, category name, description

export const addCategory = async (req: Request, res: Response ) => {
  try {  
    const connectDatabase = await connectToDatabase(); // Assuming connectToDatabase returns a Promise
    const { state_exam_name, category_name, description } = req.body;
    let query = 'INSERT INTO state_exam_category (state_exam_name, category_name, description) VALUES (?, ?, ?)';
    const queryParams = [state_exam_name, category_name, description];

    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.push(imageFilePath);
      query = 'INSERT INTO state_exam_category (state_exam_name, category_name, description, image) VALUES (?, ?, ?, ?)';
    }

    try {
      const [results] = await connectDatabase.query(query, queryParams);
      const json: any = results;  

      if (json.affectedRows === 1) {
        return res.status(200).json({message: 'State Exam Category added successfully!'});
      } else {
        return res.status(400).json({ error: 'Fail to add State Exam Category' });
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

export const getAllCategory = async (req: Request, res: Response ) => {
  const connectDatabase = await connectToDatabase();
  try{  
    const state_exam_name = req.query.state_exam_name;
    const query = 'SELECT * FROM state_exam_category WHERE state_exam_name = ?';
    const [results] = await connectDatabase.query(query, [state_exam_name]);
    const json: any = results; 
      if(json){
        return res.status(200).json(json);        
      }
  } catch(err:any) {
    return handleDatabaseError(res, err);
  }
}