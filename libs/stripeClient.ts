/**
 * This module provides a function to initialize and retrieve the Stripe instance.
 *
 * @returns {Promise<Stripe | null>} A promise that resolves to the Stripe instance.
 */

import { loadStripe, Stripe } from "@stripe/stripe-js";

// Declare a promise to hold the Stripe instance
let stripePromise: Promise<Stripe | null>;

/**
 * This function initializes and retrieves the Stripe instance.
 * It checks if the instance already exists; if not, it loads the Stripe library.
 *
 * @returns {Promise<Stripe | null>} A promise that resolves to the Stripe instance.
 */
export const getStripe = () => {
  if (!stripePromise) {
    // Load the Stripe library using the public publishable key
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );
  }

  return stripePromise;
};
