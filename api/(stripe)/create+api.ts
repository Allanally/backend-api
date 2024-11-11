/* eslint-disable prettier/prettier */
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
  const body = await request.json();
  const { name, email, amount, paymentMethodId } = body;
  console.log('Request body in /create endpoint:', body);

  if (!name || !email || !amount) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  let customer;
  const doesCustomerExist = await stripe.customers.list({
    email,
  });

  console.log('Creating customer with:', { name, email });

  if (doesCustomerExist.data.length > 0) {
    customer = doesCustomerExist.data[0];
  } else {
    const newCustomer = await stripe.customers.create({
      name,
      email,
    });

    customer = newCustomer;
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-06-20" },
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

   console.log("PaymentIntent created successfully:", paymentIntent);

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
    }),
  );
  } catch (error) {
    console.log(error)
  }
}
