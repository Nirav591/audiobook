import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { addBook, getAllBooks, getFilterBooks } from '../controllers/books.controller';

const router: Router = express.Router();

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../uploads/'));
      },
      filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + fileExtension;
        cb(null, fileName);
      },
    });
    
const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), addBook)
      .get('/filter', getFilterBooks)            
      .get('/', getAllBooks);


export default router;