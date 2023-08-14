/**
 * This code defines a serverless function for handling a subscription creation process using Next.js and Stripe.
 * It imports necessary dependencies and utilizes Supabase for authentication and user management.
 * The function creates a Stripe Checkout session for subscription, handles user data, and returns the session ID.
 * In case of errors, it logs the error and returns an internal error response.
 */

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST(request: Request) {
  // Parse incoming JSON data from the request
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    // Initialize Supabase client for authentication
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Create or retrieve customer based on user information
    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || "",
      email: user?.email || "",
    });

    // Create a Stripe Checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`,
    });

    // Return the session ID as a JSON response
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    // Log errors and return an internal error response
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
