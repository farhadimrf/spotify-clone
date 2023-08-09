// Import necessary dependencies and modules.
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { Price, Product } from "@/types";
import { stripe } from "./stripe";
import { toDateTime } from "./helpers";

// Set up connection to the Supabase database.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Function to upsert product data into Supabase "products" table.
const upsertProductRecord = async (product: Stripe.Product) => {
  // Prepare product data for insertion/update.
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  // Upsert product data into Supabase.
  const { error } = await supabaseAdmin.from("products").upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

// Function to upsert price data into Supabase "prices" table.
const upsertPriceRecord = async (price: Stripe.Price) => {
  // Prepare price data for insertion/update.
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  // Upsert price data into Supabase.
  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

// Function to create or retrieve a customer from Supabase and Stripe.
const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  // Check if customer with given UUID exists in Supabase.
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  // If customer doesn't exist, create in Stripe and insert into Supabase.
  if (error || !data?.stripe_customer_id) {
    // Prepare customer data for creation.
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      };
    if (email) customerData.email = email;

    // Create customer in Stripe and insert into Supabase.
    const customer = await stripe.customers.create(customerData);
    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

// Function to copy billing details to customer in Stripe and Supabase.
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  // Extract customer ID and billing details.
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;

  // If billing details are complete, update customer in Stripe and Supabase.
  if (!name || !phone || !address) return;

  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });

  // Update user's billing details in Supabase.
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (error) throw error;
};

// Function to manage subscription status changes.
const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Retrieve customer's UUID from Supabase mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  // Retrieve subscription details from Stripe.
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  // Prepare subscription data for insertion/update in Supabase.
  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      // @ts-ignore
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      // TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null,
    };

  // Upsert subscription data into Supabase.
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // If creating a new subscription, copy billing details to customer.
  // NOTE: This operation is costly and should be done at the end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

// Export the functions for use in other parts of the application.
export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
