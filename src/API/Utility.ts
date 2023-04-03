/* nDaysAgo() returns date object for 00:00:00 local time, n full days before now
 *
 * e.g. if now is 11/5/2021 01:02:03 local time,
 * then dayStartDaysAgo(3) returns a Date object for
 * 11/2/2021 00:00:00 local time
 */
export const nDaysAgo = (n: number = 0): Date => {
  const now = new Date();
  let midnight: number =
    now.getTime() -
    now.getHours() * 3600 * 1000 -
    now.getMinutes() * 60 * 1000 -
    now.getSeconds() * 1000 -
    now.getMilliseconds();
  let retval: Date;
  if (n > 1) {
    retval = new Date(midnight - (n - 1) * 24 * 3600 * 1000);
  } else {
    retval = new Date(midnight);
  }
  return retval;
};

export const inSameDay = (x: Date, ref: Date): boolean => {
  // const adjHours = 11; // how many hours to adjust
  // let adjustedRef = new Date(ref.getTime() + (11 * 60 * 60000));
  return (
    x.getDate() === ref.getDate() &&
    x.getMonth() === ref.getMonth() &&
    x.getFullYear() === ref.getFullYear()
  );
};

// find the median in an array of numbers
export const median = (array: number[]): number => {
  if (array.length === 0) {
    return 0;
  }
  const sorted = array.slice().sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2) {
    return sorted[half];
  }
  return (sorted[half - 1] + sorted[half]) / 2.0;
};
