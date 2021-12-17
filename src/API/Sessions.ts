import { i } from "mathjs";
import type {
  RawReview,
  Review,
  ReviewCollection,
  Session,
  Subject,
} from "./API";
import { getSubject } from "./Subjects";

declare var wkof: any;

// Utility function for debugging
const logObj = (title: string, obj: any): void => {
  console.log(`${title}: ${JSON.stringify(obj, null, 2)}`);
};

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
  if (!reviews?.length) {
    return [];
  }
  const converted: Review[] = reviews
    .map(initializeReview)
    .map(calculateDuration);

  const processed: Review[] = await calculateQuestions(converted);

  // Just assume the final review duration was the median of the prior reviews
  // (no way to know actual duration)
  let durations: number[] = processed.slice(0, -1).map((r) => r.duration);
  let medianInterval: number = median(durations);
  if (processed.length) {
    processed[processed.length - 1].duration = medianInterval;
  }

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
  return processReviews(collection?.data);
};

const findSessionEnds = (reviews: Review[]): number[] => {
  const durations = reviews.map((r) => r.duration);
  const min_duration = Math.min(...durations);
  const max_duration = Math.max(...durations);

  // Heuristic: no duration > 10min means single-review sessions
  if (min_duration > 1000 * 60 * 10) {
    return durations.map((r, i) => i);
  } else {
    // Use the "Median absolute deviation" to find outlier durations that
    // indicate the start of a new session.

    // See this blog post for an excellent description of MAD:
    // https://hausetutorials.netlify.app/posts/2019-10-07-outlier-detection-with-median-absolute-deviation/

    // first find the deviations from the median
    const median_duration = median(durations);
    const duration_deviations = reviews.map((r) =>
      Math.abs(r.duration - median_duration)
    );

    // Assume normal distribution
    const MAD_K = 1.4826;

    // Next, find the median of the deviations (assume normal distribution of
    // durations within a session -- this is where 1.4826 comes from)
    const median_absolute_deviation = median(duration_deviations) * MAD_K;

    // Now, calculate the MAD for each duration
    const initial_mads = duration_deviations.map((d) => {
      return median_absolute_deviation > 0
        ? Math.abs(d - median_duration) / median_absolute_deviation
        : Math.abs(d - median_duration) / median_duration;
    });

    // Cutoff value: MAD values greater than the cuttoff indicate the start of a
    // new session, lower values find more sessions
    const MAD_CUTOFF = 10.0;

    // Force final duration MAD to be huge if it isn't already since the last
    // review is always the end of a session
    const duration_mads =
      initial_mads[initial_mads.length - 1] > MAD_CUTOFF
        ? initial_mads
        : [...initial_mads.slice(0, -1), 999999];

    // Say 3 sessions in 12 reviews: reviews 0-3, 4-5, and 6-12
    // Want to reate arrays of start and end indices such that:
    //   starts = [0, 4, 6]
    //   ends   = [3, 5, 12]
    // Note that reviews 3, 5, and 12 will have a duration MAD > 2.0
    const indices = reviews.map((r, i) => i);
    const filtered = indices.filter((r, i) => duration_mads[i] > MAD_CUTOFF);
    return filtered;
  }
};

// Get sessions from n days ago
export const getSessions = async (n: number = 3): Promise<Session[]> => {
  const reviews: Review[] = await getReviews(nDaysAgo(n));

  return new Promise((resolve, reject) => {
    if (reviews.length === 0) {
      resolve([]);
    }

    // Find the indices of reviews with long durations (indicating the end of a
    // session)
    const session_ends = findSessionEnds(reviews);

    // First start is always index 0, then the index after the end of each
    // session (slice off the last start to keep ends[] and starts[] the
    // same length)
    const session_starts: number[] = [
      0,
      ...session_ends.map((i) => i + 1),
    ].slice(0, -1);

    // Create some "proto Sessions" objects for these review sequences
    const sessionSlices: { reviews: Review[] }[] = session_ends.map(
      (end, i) => {
        return {
          reviews: reviews.slice(session_starts[i], end + 1),
        };
      }
    );

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
