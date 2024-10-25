import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Creating PaymentIntent...');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1999,
        currency: 'usd',
      });
      console.log('PaymentIntent created:', paymentIntent.id);
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error('Error creating PaymentIntent:', err);
      res.status(500).json({ statusCode: 500, message: (err as Error).message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
