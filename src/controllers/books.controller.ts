import { Response, Request } from 'express';
import { connectToDatabase } from '../config/sql.config';

const handleDatabaseError = (res: Response, err: Error) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const connectDatabase = await connectToDatabase(); // Assuming connectToDatabase returns a Promise
    const { state_exam_name, category_name, type, title, writer, no_of_books, price } = req.body;
    const files= req.files as  {[fieldname: string]: Express.Multer.File[]};
    
    if (files) {
      const imageFile=files['image'][0];
      const pdfFile=files['pdf'][0];
      const bookImgPath = `uploads/${imageFile.filename}`;
      const pdfFilePath = `uploads/${pdfFile.filename}`;

      let query = 'INSERT INTO books (book_img, state_exam_name, category_name, type, title, writer, no_of_books, price, pdf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const queryParams = [bookImgPath, state_exam_name, category_name, type, title, writer, no_of_books, price, pdfFilePath];

      try {
        const [results] = await connectDatabase.query(query, queryParams);
        const json: any = results;

        if (json.affectedRows === 1) {
          return res.status(200).json({ message: 'Book added successfully!' });
        } else {
          return res.status(400).json({ error: 'Fail to add Book' });
        }
      } catch (err: any) {
        return handleDatabaseError(res, err);
      } finally {
        await connectDatabase.end(); // Close the connection when done
      }
    } else {
      return res.status(400).json({ error: 'No files uploaded' });
    }
  } catch (err: any) {
    return handleDatabaseError(res, err);
  }
};

export const getAllBooks = async (req: Request, res: Response ) => {
  const connectDatabase = await connectToDatabase();
  try{ 
    const state_exam_name = req.query.state_exam_name;  
    const category_name = req.query.category_name;
    const query = 'SELECT * FROM books WHERE state_exam_name = ? AND category_name = ?';
    const [results] = await connectDatabase.query(query, [state_exam_name, category_name]);
    const json: any = results; 
      if(json){
        return res.status(200).json(json);        
      }
  } catch(err:any) {
    return handleDatabaseError(res, err);
  }
}

export const getFilterBooks = async (req: Request, res: Response ) => {
  const connectDatabase = await connectToDatabase();
  try{ 
    const bookType = req.query.type;  
    const query = 'SELECT * FROM books WHERE type = ?';
    const [results] = await connectDatabase.query(query, [bookType]);
    const json: any = results; 
      if(json){
        return res.status(200).json(json);        
      }
  } catch(err:any) {
    return handleDatabaseError(res, err);
  }
}