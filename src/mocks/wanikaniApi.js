import { factory, primaryKey, oneOf, manyOf } from "@mswjs/data";
import { mersenne, date, datatype } from "faker";

// Randomness seed to ensure faker returns same values every run
mersenne.seed(12345);

// factory to generate syntactically correct JSON from API
// (incorrect semantics: dates are random, for example)
export const wkApiFactory = factory({
  reviewData: {
    created_at: primaryKey(() => date.past(3)),
    assignment_id: () => datatype.number({ max: 999999 }),
    spaced_repetition_system_id: () => datatype.number({ max: 9 }),
    subject_id: () => datatype.number({ max: 9000 }),
    starting_srs_stage: () => datatype.number({ max: 9 }),
    ending_srs_stage: () => datatype.number({ max: 9 }),
    incorrect_meaning_answers: () => datatype.number({ max: 3 }),
    incorrect_reading_answers: () => datatype.number({ max: 3 }),
  },
  review: {
    id: primaryKey(() => datatype.number({ max: 999999 })),
    object: () => "review",
    url: () =>
      `https://api.wanikani.com/v2/reviews/${datatype.number({ max: 999999 })}`,
    data_updated_at: () => date.past(1),
    data: oneOf("reviewData"),
  },
  reviewCollection: {
    object: () => "collection",
    url: () => "https://api.wanikain.com/v2/reviews",
    pages: {
      next_url: () => null,
      previous_url: () => null,
      per_page: () => 500,
    },
    total_count: () => datatype.number({ max: 500 }),
    data_updated_at: primaryKey(() => date.past(3)),
    data: manyOf("review"),
  },
  subject: {
    id: primaryKey(() => datatype.number({ max: 9999 })),
    object: () => "kanji",
  },
});

// TODO: Collections!! subject, assignment, &tc.
