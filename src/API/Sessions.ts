import type { number } from "yup";
import type { RawReview, Review, ReviewCollection, Session } from "./API";

declare var wkof: any;

const logObj = (title: string, obj: any): void => {
  console.log(`${title}: ${JSON.stringify(obj, null, 2)}`);
};

const MAXINTERVAL = 600000; // >10 minutes between reviews indicates new session

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
  return new Date(midnight - n * 24 * 3600 * 1000);
};

// find the median in an array of numbers
const median = (array: number[]): number => {
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

const getSubject = (id: number) => {
  return { object: "kanji" }; // TODO
};

// create a processed review from the raw review JSON returned from server
// (populates everything except the duration)
const initializeReview = (r: RawReview): Review => {
  return {
    subject_id: r.data.subject_id,
    started: new Date(r.data.created_at),
    duration: 0,
    reading_incorrect: +r.data.incorrect_reading_answers,
    meaning_incorrect: +r.data.incorrect_meaning_answers,
    questions:
      (getSubject(+r.data.subject_id).object === "radical" ? 1 : 2) +
      +r.data.incorrect_meaning_answers +
      +r.data.incorrect_reading_answers,
  };
};

// calculate duration of reviews by peeking at next in sequence
// (duration is review-start to review-start)
// NOTE: doesn't change duration of final review in array
const calculateDuration = (r: Review, i: number, array: Review[]): Review => {
  if (array[i + 1]) {
    const nextms = array[i + 1].started.getTime();
    const thisms = r.started.getTime();
    if (nextms < thisms) {
      throw "Reviews not in sequential creation order!";
    }
    return { ...r, duration: nextms - thisms };
  } else {
    return r; // final review unchanged
  }
};

// Turn array of RawReviews into array processed reviews
const processReviews = (reviews: RawReview[]): Review[] => {
  const processed: Review[] = reviews
    .map(initializeReview)
    .map(calculateDuration);

  // Just assume the final review duration was the median of the prior reviews
  // (no way to know actual duration)
  if (processed.length) {
    processed[processed.length - 1].duration = median(
      processed.slice(0, -2).map((r) => r.duration)
    );
  }

  return processed;
};

const getReviews = (fromDate: Date) => {
  const collection: ReviewCollection = wkof.Apiv2.fetch_endpoint("reviews", {
    last_update: fromDate.toISOString(),
  });
  return processReviews(collection.data);
};

// look at durations to find last reviews in a session
const findLongDurations = (reviews: Review[]): number[] => {
  return reviews
    .map((r, i) => {
      return { index: i, duration: r.duration };
    })
    .filter((obj) => obj.duration >= MAXINTERVAL)
    .map((obj) => obj.index);
};

export const getSessions = (n: number = 3): Session[] => {
  const reviews: Review[] = getReviews(nDaysAgo(n));

  // guard clause: bail early if no reviews
  if (reviews.length === 0) {
    return [];
  }

  // Works but UGLY!!!!
  // find indexes in reviews array with long durations
  const longDurations: number[] = findLongDurations(reviews);

  // Long Durations indicate last review in a session.
  // The last review might or might not have a long duration.
  // Ensure the final review index is always the end of a session.
  const ends: number[] =
    longDurations[longDurations.length - 1] === reviews.length - 1
      ? longDurations
      : [...longDurations, reviews.length - 1];

  // The first review in a session is either index 0 in the reviews array, or
  // the next index after a long duration.
  // The first review might or might not have a long duration.
  // Ensure index 0 in the review array is always the start of a session.
  const starts: number[] =
    ends[0] === 0 ? ends : [0, ...ends.map((i) => i + 1)];

  // Create some "proto Sessions" for these review sequences
  const sessionSlices: { reviews: Review[] }[] = ends.map((end, i) => {
    return {
      reviews: reviews.slice(starts[i], end + 1),
    };
  });

  // Finally, flesh out the rest of the session object
  return sessionSlices.map((reviewSlice) => {
    return {
      questions: reviewSlice.reviews.reduce(
        (acc, review) => acc + review.questions,
        0
      ),
      reading_incorrect: reviewSlice.reviews.reduce(
        (acc, review) => acc + review.reading_incorrect,
        0
      ),
      meaning_incorrect: reviewSlice.reviews.reduce(
        (acc, review) => acc + review.meaning_incorrect,
        0
      ),
      startTime: reviewSlice.reviews[0].started,
      endTime: reviewSlice.reviews[reviewSlice.reviews.length - 1].started,
      reviews: reviewSlice.reviews,
    };
  });
};
