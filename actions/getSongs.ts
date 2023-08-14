/**
 * This module contains a function for fetching songs from a Supabase database using
 * server-side rendering and authentication helpers from Next.js and Supabase.
 *
 * The function queries the "songs" table to retrieve song data.
 * It returns an array of song objects, each containing song details.
 *
 * The function uses the Supabase client and authentication helpers to securely retrieve data.
 * It then orders the retrieved songs by their creation date in descending order.
 *
 * If an error occurs during the data retrieval process, it is logged, and an empty array is returned.
 * If no data is available, an empty array is returned as well.
 *
 * @returns {Promise<Song[]>} An array of song objects.
 */

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
  // Initialize Supabase client for server-side authentication
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // Query all songs and order by creation date in descending order
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  // Log errors if they occur
  if (error) console.log(error);

  // Return the retrieved data as an array or an empty array if no data is available
  return (data as any) || [];
};

export default getSongs;
