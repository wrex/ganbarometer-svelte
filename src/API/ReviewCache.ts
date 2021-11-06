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

// getReviews(token, n) return n days of reviews
export const getReviews = async (token: string, daysBack: number = 3) => {
  const time = dayStartDaysAgo(daysBack).toISOString();

  const requestHeaders = new Headers({
    "Wanikani-Revision": "20170710",
    Authorization: `Bearer ${token}`,
  });

  const apiEndpoint = new Request(
    `https://api.wanikani.com/v2/reviews?updated_after=${time}`,
    {
      method: "GET",
      headers: requestHeaders,
    }
  );

  return fetch(apiEndpoint).then((res) => res.json());
};
