import { Response, Request } from 'express';
import { connectToDatabase } from '../config/sql.config';

const handleDatabaseError = (res: Response, err: Error) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

export const addStateExam = async (req: Request, res: Response ) => {
  try {  
    const connectDatabase = await connectToDatabase(); // Assuming connectToDatabase returns a Promise
    const { state_exam_name } = req.body;
    let query = 'INSERT INTO state_exam (state_exam_name) VALUES (?)';
    const queryParams = [state_exam_name];

    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.unshift(imageFilePath);
      query = 'INSERT INTO state_exam (image, state_exam_name) VALUES (?, ?)';
    }

    try {
      const [results] = await connectDatabase.query(query, queryParams);
      const json: any = results;  

      if (json.affectedRows === 1) {
        return res.status(200).json({message: 'State Exam added successfully!'});
      } else {
        return res.status(400).json({ error: 'Fail to add State Exam' });
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

export const getAllStateExams = async (req: Request, res: Response ) => {
  const connectDatabase = await connectToDatabase();
  try{   
    const query = 'SELECT * FROM state_exam';
    const [results] = await connectDatabase.query(query);
    const json: any = results; 
      if(json){
        return res.status(200).json(json);        
      }
  } catch(err:any) {
    return handleDatabaseError(res, err);
  }
}