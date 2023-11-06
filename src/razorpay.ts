import Razorpay from 'razorpay';
import { Response, Request } from 'express';

export const getPayment = async (req: Request, res: Response ) => {
  const {amount} = req.body;

  const razorpay = new Razorpay({
    key_id: 'rzp_test_iDOIBWHERJGQqI',
    key_secret: 'S7rwl9ZfEaWJvkJZQa65X1ZK',
  });
  
  // Example: Create an order
  const order = await razorpay.orders.create(
    {
      amount: amount * 100,  // Amount in paisa (1000 = ₹10)
      currency: 'INR',
      receipt: 'order_rcptid_11',
    })
  
    res.status(201).json({ success : true, order, amount})  
}