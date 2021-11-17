import type { number } from "yup";

declare var wkof: any;
// API returns strings for everything
interface RawReview {
  id: string;
  object: string;
  url: string;
  data_updated_at: string;
  data: {
    created_at: string;
    assignment_id: string;
    spaced_repetition_system_id: string;
    subject_id: string;
    starting_srs_stage: string;
    ending_srs_stage: string;
    incorrect_meaning_answers: string;
    incorrect_reading_answers: string;
  };
}

interface ReviewCollection {
  object: string;
  url: string;
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  total_count: number;
  data_updated_at: string;
  data: RawReview[];
}

type RKV = "radical" | "kanji" | "vocabulary";
interface Review {
  subject_id: string;
  started: Date;
  duration: number; // milliseconds
  questions: number;
  reading_incorrect: number;
  meaning_incorrect: number;
  type: RKV;
}

interface Session {
  questions: number;
  radicals: number;
  kanji: number;
  vocabulary: number;
  reading_incorrect: number;
  meaning_incorrect: number;
  startTime: Date;
  endTime: Date;
  reviews: Review[];
}

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

const median = (array: number[]) => {
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

const processReviews = (reviews: RawReview[]) => {
  let results = [] as Review[];
  reviews.forEach((r, i) => {
    const processed = {} as Review;
    processed.subject_id = r.data.subject_id;

    processed.started = new Date(r.data_updated_at);
    processed.duration = 0;
    processed.reading_incorrect = +r.data.incorrect_reading_answers;
    processed.meaning_incorrect = +r.data.incorrect_meaning_answers;
    processed.type = "kanji"; // TODO
    processed.questions =
      2 + processed.reading_incorrect + processed.meaning_incorrect;
    results.push(processed);
  });

  // Need to look at next review to calculate duration
  // Note: last review ends with a duration of 0 mS
  results.forEach((r, i) => {
    if (results[i + 1]) {
      const nextTime = results[i + 1].started.getTime();
      const thisTime = r.started.getTime();
      if (nextTime < thisTime) {
        throw "Reviews not in sequential creation order!";
      }
      r.duration = results[i + 1].started.getTime() - r.started.getTime();
    }
  });

  // Just assume the final review took median time (no way to know for sure)
  if (results.length) {
    results[results.length - 1].duration = median(
      results.map((r) => r.duration)
    );
  }

  return results;
};

export const getSessions = (n: number = 3) => {
  const collection: ReviewCollection = wkof.Apiv2.fetch_endpoint("reviews", {
    last_update: nDaysAgo(n),
  });
  console.log(JSON.stringify(collection, null, 2));
  const reviews = processReviews(collection.data);

  const sessions = [] as Session[];

  let session: Session;

  // iterate through reviews, finding sessions closer than 10min apart
  let inSession = false;
  reviews.forEach((r) => {
    if (!inSession) {
      // First review - create a session object
      session = {
        startTime: r.started,
        endTime: new Date(r.started),
        questions: 2,
        radicals: 0,
        kanji: 1, // TODO
        vocabulary: 0,
        reading_incorrect: r.reading_incorrect,
        meaning_incorrect: r.meaning_incorrect,
        reviews: [r],
      };
      if (r.duration >= 600000) {
        // this is only review in the session
        sessions.push(session);
        inSession = false;
      } else {
        inSession = true; // loop to get other reviews
      }
    } else if (r.duration >= 600000) {
      // This is final review within a session
      session.reading_incorrect += r.reading_incorrect;
      session.meaning_incorrect += r.meaning_incorrect;
      session.questions += 2 + r.reading_incorrect + r.meaning_incorrect;
      session.kanji += 1; // TODO
      session.reviews.push(r);
      session.endTime = r.started;
      sessions.push(session);
      inSession = false;
    } else {
      // In the middle of a sequence
      session.reading_incorrect += r.reading_incorrect;
      session.meaning_incorrect += r.meaning_incorrect;
      session.questions += 2 + r.reading_incorrect + r.meaning_incorrect;
      session.kanji += 1; // TODO
      session.reviews.push(r);
    }
  });
  if (inSession) {
    // final review wasn't added
    if (sessions.length > 1) {
      session.endTime = new Date(sessions[sessions.length - 1].endTime);
    }
    sessions.push(session);
  }
  // assume final review took 30s
  if (sessions.length) {
    let finalSession = sessions[sessions.length - 1];
    let finalReview = session.reviews[session.reviews.length - 1];
    finalSession.endTime.setTime(finalReview.started.getTime() + 30000);
  }

  return sessions;
};
