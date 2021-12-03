import type {
  RawReview,
  Review,
  ReviewCollection,
  Session,
  Subject,
} from "./API";
import { std as sigma } from "mathjs";
import { getSubject } from "./Subjects";

declare var wkof: any;

// Utility function for debugging
const logObj = (title: string, obj: any): void => {
  console.log(`${title}: ${JSON.stringify(obj, null, 2)}`);
};

// Maximum number of ms between reviews before it's considered a new review
// Default to 10 minutes, but use an algorithm to find a more suitable value
// once reviews are retrieved and processed
let MAXINTERVAL = 600000;

// Global to store the median interval between all reviews
let MEDIANINTERVAL;

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

// create a processed review from the raw review JSON returned from server
// (populates everything except the duration)
const initializeReview = (r: RawReview) => {
  return {
    subject_id: r.data.subject_id,
    started: new Date(r.data.created_at),
    duration: 0,
    reading_incorrect: +r.data.incorrect_reading_answers,
    meaning_incorrect: +r.data.incorrect_meaning_answers,
    questions: 0,
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

// update the global MAXINTERVAL with a heuristic
const updateMaxInterval = (durations: number[]): void => {
  // guard clause: keep default unless there are some durations
  if (!durations.length) {
    return;
  }

  // First pass: clamp maximum durations to current MAXINTERVAL (default: 10m)
  const clampedDurations = durations.map((d) =>
    d > MAXINTERVAL ? MAXINTERVAL : d
  );

  // Find the new median to be safe (shouldn't have changed much)
  const newMedian = median(clampedDurations);

  // Heuristic:
  MAXINTERVAL = Math.max(newMedian + 2 * sigma(clampedDurations), 600000);
};

const calculateQuestions = async (reviews: Review[]): Promise<Review[]> => {
  let reviewsCopy = reviews.slice();

  for (let review of reviewsCopy) {
    const subject: Subject = await getSubject(+review.subject_id);
    review.questions = subject.object === "radical" ? 1 : 2;
    review.questions += review.meaning_incorrect + review.reading_incorrect;
  }
  return new Promise((resolve, reject) => resolve(reviewsCopy));
};

// Turn array of RawReviews into array processed reviews
const processReviews = async (reviews: RawReview[]): Promise<Review[]> => {
  const initialized: Review[] = reviews.map(initializeReview);

  const converted: Review[] = initialized.map(calculateDuration);

  const processed: Review[] = await calculateQuestions(converted);

  // Just assume the final review duration was the median of the prior reviews
  // (no way to know actual duration)
  let durations: number[] = processed.slice(0, -1).map((r) => r.duration);
  let medianInterval: number = median(durations);
  if (processed.length) {
    processed[processed.length - 1].duration = medianInterval;
  }

  // Calculate a better value for MAXINTERVAL global than the 10m default
  updateMaxInterval(durations);

  return new Promise((resolve, reject) => resolve(processed));
};

const getReviews = async (fromDate: Date) => {
  // First retrieve raw reviews
  wkof.include("Apiv2");
  await wkof.ready("Apiv2");
  const collection: ReviewCollection = await wkof.Apiv2.fetch_endpoint(
    "reviews",
    {
      last_update: fromDate.toISOString(),
    }
  );
  return await processReviews(collection.data);
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

// Get (possibly cached) sessions from n days ago
export const getSessions = async (n: number = 3) => {
  const reviews: Review[] = await getReviews(nDaysAgo(n));

  return new Promise((resolve, reject) => {
    // guard clause: bail early if no reviews
    if (reviews.length === 0) {
      resolve([]);
    }

    // Complicated, but functional:
    // Say 3 sessions: reviews 0-3, 4-5, and 6-12
    // Create an array of start and end indices such that:
    //   starts = [0, 4, 6]
    //   ends   = [3, 5, 12]

    // Note that reviews 3, 5, and MAYBE 12 will have a long duration

    // first find indexes in reviews array with long durations
    const longDurations: number[] = findLongDurations(reviews);

    // The last review in a session will always have a long duration.
    // But the final review retrieved might not have a long duration.
    // Include the final review index if it isn't already there
    const lastLongDurationIndex = longDurations[longDurations.length - 1];
    const finalReviewIndex = reviews.length - 1;
    const ends: number[] =
      lastLongDurationIndex === finalReviewIndex
        ? longDurations
        : [...longDurations, reviews.length - 1];

    // First start is always index 0, then the index after the end of each
    // session (slice off the last start to keep ends[] and starts[] the
    // same length)
    const starts: number[] = [0, ...ends.map((i) => i + 1)].slice(0, -1);

    // Create some "proto Sessions" objects for these review sequences
    const sessionSlices: { reviews: Review[] }[] = ends.map((end, i) => {
      return {
        reviews: reviews.slice(starts[i], end + 1),
      };
    });

    // Finally, flesh out the rest of the session object
    resolve(
      sessionSlices.map((reviewSlice) => {
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
      })
    );
  });
};
