import axios from "axios";
import localforage from "localforage";

/* dayStartDaysAgo() returns date object for 00:00:00 local time, n full days before now
 *
 * e.g. if now is 11/5/2021 01:02:03 local time,
 * then dayStartDaysAgo(3) returns a Date object for
 * 11/2/2021 00:00:00 local time
 */
export const dayStartDaysAgo = (n: number = 0): Date => {
  const now = new Date();
  let midnight: number =
    now.getTime() -
    now.getHours() * 3600 * 1000 -
    now.getMinutes() * 60 * 1000 -
    now.getSeconds() * 1000 -
    now.getMilliseconds();
  return new Date(midnight - n * 24 * 3600 * 1000);
};

// fetch raw reviews via the wanikani API
export const fetchReviews = async (token: string, daysBack: number = 3) => {
  const time = dayStartDaysAgo(daysBack).toISOString();

  const endpoint = "https://api.wanikani.com/v2/reviews";

  const response = await axios.get(endpoint, {
    params: {
      updated_after: time,
    },
    headers: {
      "Wanikani-Revision": "20170710",
      Authorization: `Bearer ${token}`,
    },
  });
  // Broken super-simple implementation for first green
  let result = await localforage.setItem("gb_review_cache", response.data.data);
  return response;
};
