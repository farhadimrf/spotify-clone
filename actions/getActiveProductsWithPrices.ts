/**
 * This module contains a function for fetching active products with their associated prices
 * from a Supabase database using server-side rendering and authentication helpers from Next.js and Supabase.
 *
 * The function queries the "products" table for products that are marked as active and have active prices.
 * It returns an array of product objects, each containing product details along with their associated prices.
 *
 * The authentication helpers ensure proper server-side authentication using cookies.
 * If an error occurs during the data retrieval process, it is logged.
 *
 * @returns {Promise<ProductWithPrice[]>} An array of product objects with associated prices.
 */

import { ProductWithPrice } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  // Initialize Supabase client for server-side authentication
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // Query for active products with their prices
  const { data, error } = await supabase
    .from("products")
    .select("*,prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  // Log errors if they occur
  if (error) console.log(error);

  // Return the retrieved data as an array or an empty array if no data is available
  return (data as any) || [];
};

export default getActiveProductsWithPrices;
