import express, { Router } from 'express';
import { createSlider, getSlider } from '../controllers/slider.controller';
import multer from 'multer';
import path from 'path';

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
    
router.post('/', upload.single('image'), createSlider)      
      .get('/', getSlider);


export default router;