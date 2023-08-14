/**
 * This module contains a function for fetching songs created by the authenticated user
 * from a Supabase database using server-side rendering and authentication helpers from Next.js and Supabase.
 *
 * The function first retrieves the user's session data using the authentication helper.
 * It then queries the "songs" table to retrieve song data associated with the user.
 * It returns an array of song objects, each containing song details.
 *
 * The function uses the Supabase client and authentication helpers to securely retrieve data.
 * The retrieved data is ordered by creation date in descending order.
 *
 * If an error occurs during the session retrieval, it is logged, and an empty array is returned.
 * If an error occurs during the data retrieval process, it is logged, and an empty array is returned as well.
 *
 * @returns {Promise<Song[]>} An array of song objects created by the authenticated user.
 */

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
  // Initialize Supabase client for server-side authentication
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // Retrieve user's session data
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  // Log session retrieval errors and return an empty array
  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  // Query songs associated with the user and order by creation date in descending order
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session?.user.id)
    .order("created_at", { ascending: false });

  // Log data retrieval errors and return an empty array
  if (error) console.log(error.message);

  // Log the retrieved data and return it as an array or an empty array if no data is available
  console.log(data);

  return (data as any) || [];
};

export default getSongsByUserId;
