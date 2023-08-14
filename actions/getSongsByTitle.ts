/**
 * This module contains a function for fetching songs with a specific title (or all songs if no title is provided)
 * from a Supabase database using server-side rendering and authentication helpers from Next.js and Supabase.
 *
 * The function queries the "songs" table to retrieve song data that matches the provided title or pattern.
 * It returns an array of song objects, each containing song details.
 *
 * The function first checks if a title is provided; if not, it uses the "getSongs" function to fetch all songs.
 * If a title is provided, it uses the Supabase client to query songs with a title that matches the provided pattern.
 * The retrieved data is ordered by creation date in descending order.
 *
 * If an error occurs during the data retrieval process, it is logged, and an empty array is returned.
 * If no data is available, an empty array is returned as well.
 *
 * @param {string} title - The title or pattern to search for in song titles.
 * @returns {Promise<Song[]>} An array of song objects matching the provided title or pattern.
 */

import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  // Initialize Supabase client for server-side authentication
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  // If no title is provided, fetch all songs using the getSongs function
  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  // Query songs by title pattern and order by creation date in descending order
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  // Log errors if they occur
  if (error) console.log(error);

  // Return the retrieved data as an array or an empty array if no data is available
  return (data as any) || [];
};

export default getSongsByTitle;
