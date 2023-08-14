/**
 * This module provides utility functions for working with URLs, posting data, and converting Unix timestamps to date and time objects.
 *
 * @returns {string} The complete URL with proper protocol (https://) and trailing slash.
 * @param {string} url - The input URL.
 */

import { Price } from "@/types";

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";

  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;

  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
};

/**
 * This function posts data to a specified URL using the fetch API.
 * It handles headers, credentials, and response status.
 *
 * @param {string} url - The URL to which the data should be posted.
 * @param {object} data - The data to be posted (optional).
 * @returns {Promise<object>} The parsed JSON response from the post request.
 */
export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log("posting,", url, data);

  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, data, res });
    throw Error(res.statusText);
  }

  return res.json();
};

/**
 * This function converts Unix timestamps (in seconds) to JavaScript Date objects.
 *
 * @param {number} secs - The Unix timestamp in seconds.
 * @returns {Date} The JavaScript Date object representing the converted timestamp.
 */
export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
