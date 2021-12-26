import type { Review, ReviewCount } from "../API/API";

export const inSameDay = (x: Date, ref: Date): boolean => {
  return (
    x.getDate() === ref.getDate() &&
    x.getMonth() === ref.getMonth() &&
    x.getFullYear() === ref.getFullYear()
  );
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
