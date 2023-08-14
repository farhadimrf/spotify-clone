// Import necessary modules and dependencies.
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Import local modules.
import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";

// Define a set of relevant Stripe webhook event types.
const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

// Define a function to handle incoming POST requests to the webhook endpoint.
export async function POST(request: Request) {
  // Read the request body as text and get the Stripe-Signature header.
  const body = await request.text();
  const sig = headers().get("Stripe-Signature");

  // Get the appropriate webhook secret based on environment.
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    // Verify the Stripe event using the webhook secret and signature.
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    // Handle webhook verification or construction errors.
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Process the event if it is relevant.
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      // Handle errors during event processing.
      console.log(error);
      return new NextResponse(
        'Webhook error: "Webhook handler failed. View logs."',
        { status: 400 }
      );
    }
  }

  // Return a success response.
  return NextResponse.json({ received: true }, { status: 200 });
}
