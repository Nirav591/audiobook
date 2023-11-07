import express from 'express';
import stateExamCatRoute from './routes/state-exam-category.route';
import authRoute from './routes/auth.route';
import sliderRoute from './routes/slider.route';
import stateExamRoute from './routes/state-exam.route';
import bookRoute from './routes/books.route';
import { getPayment } from './razorpay';

const app = express();
app.use(express.json());

const port = 6300;

app.use('/auth', authRoute);
app.use('/slider', sliderRoute);
app.use('/state-exam', stateExamRoute);
app.use('/state-exam-cat', stateExamCatRoute);
app.use('/books', bookRoute);
app.use('/payment', getPayment)



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
