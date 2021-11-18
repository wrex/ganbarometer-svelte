import type { RawReview, Review, ReviewCollection, Session } from "./API";

declare var wkof: any;

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

const questionsForSubject = (subjectId: number): number => {
  return 2; // TODO: lookup subject (2 for K or V, 1 for R)
};

// Turn array of RawReviews into array processed reviews
const processReviews = (reviews: RawReview[]) => {
  const initial: Review[] = reviews.map((r) => {
    return {
      subject_id: r.data.subject_id,
      started: new Date(r.data.created_at),
      duration: 0,
      reading_incorrect: +r.data.incorrect_reading_answers,
      meaning_incorrect: +r.data.incorrect_meaning_answers,
      questions:
        questionsForSubject(+r.data.subject_id) +
        +r.data.incorrect_meaning_answers +
        +r.data.incorrect_reading_answers,
    };
  });

  // now calculate durations
  // calculate durations of reviews by peeking at next in sequence
  // (duration is review-start to review-start)
  // NOTE: leaves last duration at 0
  const processed = initial.map((r, i) => {
    if (initial[i + 1]) {
      const nextms = initial[i + 1].started.getTime();
      const thisms = r.started.getTime();
      if (nextms < thisms) {
        throw "Reviews not in sequential creation order!";
      }
      return { ...r, duration: nextms - thisms };
    } else {
      return r;
    }
  });

  // calculateDurations(processed);

  // Just assume the final review duration was the median of the prior reviews
  // (no way to know for sure)
  if (processed.length) {
    processed[processed.length - 1].duration = median(
      processed.slice(0, -2).map((r) => r.duration)
    );
  }

  return processed;
};

// return a session for a single review
// (Session should probably be a class with a constructor)
const initializeSession = (r: Review) => {
  return {
    startTime: r.started,
    endTime: new Date(r.started),
    questions: 0,
    reading_incorrect: r.reading_incorrect,
    meaning_incorrect: r.meaning_incorrect,
    reviews: [r],
  };
};

const MAXINTERVAL = 600000; // >10 minutes between reviews indicates new session

const getReviews = (fromDate: Date) => {
  const collection: ReviewCollection = wkof.Apiv2.fetch_endpoint("reviews", {
    last_update: fromDate.toISOString(),
  });
  return processReviews(collection.data);
};

export const getSessions = (n: number = 3): Session[] => {
  const reviews = getReviews(nDaysAgo(n));

  // array of indices into reviews with duration > MAXINTERVAL
  let sessionStartIndices: number[] = reviews
    .map((r, i) => {
      return { index: i, duration: r.duration };
    })
    .filter((obj) => obj.duration >= MAXINTERVAL)
    .map((obj) => obj.index + 1);

  if (reviews.length && sessionStartIndices.length === 0) {
    sessionStartIndices = [0];
  }

  // ensure allStarts either empty or first element is 0
  const allStarts =
    sessionStartIndices.length && sessionStartIndices[0] !== 0
      ? [0, ...sessionStartIndices]
      : sessionStartIndices;

  const slices = allStarts.map((r, i) => {
    return {
      reviews: reviews.slice(
        r,
        i + 1 >= allStarts.length ? reviews.length : allStarts[i + 1]
      ),
    };
  });

  const sessions: Session[] = slices.map((reviewSlice) => {
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

  return sessions;
};
