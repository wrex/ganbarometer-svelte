import { getSubject } from "./Subjects";
import { nDaysAgo, inSameDay, median } from "./Utility";

import type {
  Subject,
  RawReview,
  Review,
  ReviewCollection,
  ReviewCount,
} from "../API/API";
declare var wkof: any;

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
  return reviewsCopy;
};

const compareReviewDates = (a: RawReview, b: RawReview): number => {
  const a_date = new Date(a?.data?.created_at).getTime();
  const b_date = new Date(b?.data?.created_at).getTime();
  return a_date - b_date;
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

  return processed;
};

export const getReviews = async (n: number) => {
  const fromDate = nDaysAgo(n);
  // First retrieve raw reviews
  wkof.include("Apiv2");
  await wkof.ready("Apiv2");
  const collection: ReviewCollection = await wkof.Apiv2.fetch_endpoint(
    "reviews",
    {
      last_update: fromDate.toISOString(),
    }
  );

  // Need to filter and sort reviews in case they are using an offline review app
  const sortedReviews = collection?.data
    .filter(
      (r) => new Date(r?.data?.created_at).getTime() >= fromDate.getTime()
    )
    .sort(compareReviewDates);

  return processReviews(sortedReviews);
};

export const calculateCounts = (reviews: Review[]): ReviewCount[] => {
  const reviewsEachDay: Review[][] = reviews
    // first filter to one review per unique day
    .filter((r, i) =>
      i > 0 ? !inSameDay(r.started, reviews[i - 1].started) : true
    )
    // convert those reviews to just a date
    .map((r) => r.started)
    // finally, convert those dates to array of reviews on that date
    .map((date) => reviews.filter((r) => inSameDay(r.started, date)));

  let counts: ReviewCount[] = [];
  reviewsEachDay.forEach((reviewAry, i) => {
    const readingCorrect = reviewAry
      .filter((r) => r.reading_incorrect === 0)
      .reduce((acc, r) => (acc += 1), 0);
    const meaningCorrect = reviewAry
      .filter((r) => r.meaning_incorrect === 0)
      .reduce((acc, r) => (acc += 1), 0);
    const bothCorrect = reviewAry
      .filter((r) => r.meaning_incorrect + r.reading_incorrect === 0)
      .reduce((acc, r) => (acc += 1), 0);

    const questionCount = reviewAry.reduce((acc, r) => (acc += r.questions), 0);
    const itemCount = reviewAry.length;
    const count: ReviewCount = {
      start: reviewAry[0].started,
      end: reviewAry[reviewAry.length - 1].started,
      review_count: reviewAry.length,
      question_count: questionCount,
      accuracy: bothCorrect / itemCount,
      reading_accuracy: readingCorrect / itemCount,
      meaning_accuracy: meaningCorrect / itemCount,
    };
    counts.push(count);
  });
  return counts;
};
