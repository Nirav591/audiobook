import express, { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import { addStateExam, getAllStateExams } from '../controllers/state-exam.controller';

const router: Router = express.Router();

const storage = multer.diskStorage({
      destination: (req: Request , file, cb) => {
        cb(null, path.resolve(__dirname, '../uploads/'));
      },
      filename: (req: Request, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueSuffix + fileExtension;
        cb(null, fileName);
      },
    });
    
    const upload = multer({ storage });
    
router.post('/', upload.single('image'), addStateExam)      
      .get('/', getAllStateExams);


export default router;