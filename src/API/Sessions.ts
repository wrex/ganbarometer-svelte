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
  // Note: last review has a duration of 0 mS
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

  // Results are ordered in time sequence
  // Want to create an array of indices where new sessions start
  // need to know the smallest duration
  // Define as median + 2 sigma (with max duration clamped at 10 minutes)
  let durations = results.map((r) => r.duration);
  let medianInterval = median(durations);

  return { median: medianInterval, reviews: results };
};

export const getSessions = (n: number = 3) => {
  const rawReviews: RawReview[] = wkof.Apiv2.fetch_endpoint("reviews", {
    last_update: nDaysAgo(n),
  });
  const { median, reviews } = processReviews(rawReviews);

  const sessions = [] as Session[];

  let session: Session = {
    startTime: 0,
    endTime: 0,
    questions: 0,
    radicals: 0,
    kanji: 0,
    vocabulary: 0,
    reading_incorrect: 0,
    meaning_incorrect: 0,
    reviews: [],
  };

  // iterate through reviews, finding sessions closer than 10min apart
  let inSequence = false;
  reviews.forEach((r) => {
    session.reading_incorrect += r.reading_incorrect;
    session.meaning_incorrect += r.meaning_incorrect;
    session.questions += 2 + r.reading_incorrect + r.meaning_incorrect;
    session.kanji += 1; // TODO
    session.reviews.push(r);
    if (!inSequence) {
      // Start of session
      session.startTime = r.started;
      session.endTime = new Date(r.started);
      inSequence = true;
    } else if (r.duration >= 600000) {
      // Final review within a session
      session.endTime = r.started;
      sessions.push(session);
      inSequence = false;
    }
    // In the middle of a sequence, just loop
  });
  if (inSequence) {
    // final review wasn't added
    if (sessions.length > 1) {
      session.endTime = new Date(sessions[sessions.length - 1].endTime);
    }
    sessions.push(session);
  }
  // assume final review took 30s
  if (sessions.length) {
    session = sessions[sessions.length - 1];
    session.endTime.setTime(session.endTime.getTime() + 30000);
  }

  return sessions;
};
