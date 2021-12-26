import { median } from "./Utility";

import type { Review, Session } from "./API";

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
export const parseSessions = (reviews: Review[]): Session[] => {
  if (reviews.length === 0) {
    return [];
  }

  // Find the indices of reviews with long durations (indicating the end of a
  // session)
  const session_ends = findSessionEnds(reviews);

  // First start is always index 0, then the index after the end of each
  // session (slice off the last start to keep ends[] and starts[] the
  // same length)
  const session_starts: number[] = [0, ...session_ends.map((i) => i + 1)].slice(
    0,
    -1
  );

  // Create some "proto Sessions" objects for these review sequences
  const sessionSlices: { reviews: Review[] }[] = session_ends.map((end, i) => {
    return {
      reviews: reviews.slice(session_starts[i], end + 1),
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
