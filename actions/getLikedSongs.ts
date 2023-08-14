/**
 * This module contains a function for fetching liked songs for a specific user
 * from a Supabase database using server-side rendering and authentication helpers from Next.js and Supabase.
 *
 * The function queries the "liked_songs" table to retrieve songs that have been liked by the user.
 * It returns an array of song objects, each containing song details.
 *
 * The function first retrieves the user session data using the authentication helper.
 * It then uses the session information to query liked songs associated with that user.
 *
 * If an error occurs during the data retrieval process, it is logged, and an empty array is returned.
 * If no data is available, an empty array is returned as well.
 *
 * @returns {Promise<Song[]>} An array of song objects liked by the user.
 */

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
  // Initialize Supabase client for server-side authentication
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // Retrieve user session data
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Query liked songs associated with the user
  const { data, error } = await supabase
    .from("liked_songs")
    .select("*,songs(*)")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false });

  // Log errors if they occur and return an empty array
  if (error) {
    console.log(error);
    return [];
  }

  // Return an empty array if no data is available
  if (!data) return [];

  // Map the retrieved data to song objects and return the array
  return data.map((item) => ({
    ...item.songs,
  }));
};

export default getLikedSongs;
