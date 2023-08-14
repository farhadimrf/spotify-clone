/**
 * This code defines a serverless function that handles the creation of a billing portal URL for a user
 * to manage their subscription and billing information. The function uses Supabase for authentication,
 * Next.js for server-side rendering, and Stripe for billing operations.
 *
 * The function fetches user information, creates a billing portal session using Stripe,
 * and returns the URL to the user for accessing the billing portal.
 *
 * If any errors occur during the process, they are logged, and an internal error response is returned.
 */

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST() {
  try {
    // Initialize Supabase client for authentication
    const supabase = createRouteHandlerClient({ cookies });

    // Retrieve user data from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user data is not available, throw an error
    if (!user) throw Error("Could not get user");

    // Create or retrieve customer based on user information
    const customer = await createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || "",
    });

    // If customer data is not available, throw an error
    if (!customer) throw Error("Could not get customer");

    // Create a billing portal session URL using Stripe
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    // Return the billing portal URL as a JSON response
    return NextResponse.json({ url });
  } catch (err: any) {
    // Log errors and return an internal error response
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
