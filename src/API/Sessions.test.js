/*
 * @jest-environment jsdom
 */

import { parseSessions } from "./Sessions";
import { getReviews } from "./Reviews";
import { nDaysAgo } from "./Utility";
import "fake-indexeddb/auto";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import {
  mockWkof,
  mockReview,
  mockReviewCollection,
  clearMockedAPIData,
} from "../mocks/wkof";

// Setup
jest.useFakeTimers("modern");
mockWkof();
const wkofApiv2Mock = window.wkof.Apiv2.fetch_endpoint;

beforeEach(() => {
  window.indexedDB = new FDBFactory(); // reset database
});

describe("nDaysAgo()", () => {
  beforeAll(() => {
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });
  it("defaults to midnight this a.m.", () => {
    expect(nDaysAgo().toString()).toMatch(/^Sat Oct 05 2019 00:00:00/);
  });
  it("returns midnight yesterday a.m. when passed 2", () => {
    expect(nDaysAgo(2).toString()).toMatch(/^Fri Oct 04 2019 00:00:00/);
  });
  it("returns midnight three days ago when passed 3", () => {
    expect(nDaysAgo(3).toString()).toMatch(/^Thu Oct 03 2019 00:00:00/);
  });
});

describe("parseSessions()", () => {
  beforeAll(() => {
    // Make all tests start at a known point in time
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });

  afterEach(() => {
    // Clear all mocked data
    clearMockedAPIData();
  });

  it("calls wkof.Apiv2.fetch_endpoint with 'reviews' as the first param", async () => {
    mockReviewCollection([]);
    const reviews = await getReviews();
    parseSessions(reviews);
    expect(wkofApiv2Mock.mock.calls.length).toBe(1);
    expect(wkofApiv2Mock.mock.calls[0][0]).toEqual("reviews");
  });

  it("returns no session if no review fetched", async () => {
    mockReviewCollection([]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions.length).toBe(0);
  });

  xit("returns one session if only one review fetched", async () => {
    mockReviewCollection([mockReview()]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions.length).toBe(1);
  });

  xit("returns the number of reviews in the sessions object", async () => {
    mockReviewCollection([mockReview()]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions[0].reviews.length).toBe(1);
  });

  xit("returns a duration of 0 seconds if only one review fetched", async () => {
    mockReviewCollection([mockReview()]);
    const reviews = await getReviews();
    console.log(JSON.stringify(reviews, null, 2));
    const sessions = parseSessions(reviews);
    console.log(JSON.stringify(sessions, null, 2));
    expect(sessions[0].reviews.length).toBe(1);
    expect(
      sessions[0].endTime.getTime() - sessions[0].startTime.getTime()
    ).toBe(0);
  });

  xit("returns one session if small number of reviews together (within 10 minutes)", async () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:24:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:25:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:26:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:27:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:28:18.048Z" } }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions.length).toBe(1);
  });

  xit("returns two sessions if two widely spaced reviews fetched", async () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:24:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-05T04:25:18.048Z" } }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions.length).toBe(2);
  });
  xit("returns two sessions if string of 2 and 3 reviews", async () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:01:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:02:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:01:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:02:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:03:00.000Z" } }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions.length).toBe(2);
    expect(sessions[0].reviews.length).toBe(2);
    expect(sessions[1].reviews.length).toBe(3);
  });

  xit("sets final review to median duration of prior reviews", async () => {
    // median(1000, 2000, 3000, 4000, 5000, 30000) === 3000
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:00.000Z" } }), // 2s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:02.000Z" } }), // 1s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:03.000Z" } }), // 5s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:08.000Z" } }), // 4s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:12.000Z" } }), // 3s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:15.000Z" } }), // unknown (30s)
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions.length).toBe(1);
    expect(sessions[0].reviews.length).toBe(6);
    expect(sessions[0].reviews[5].duration).toBe(3000);
  });

  xit("only counts one question for radicals", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "123", object: "radical" },
        reviewData: {
          incorrect_meaning_answers: 0,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions[0].questions).toBe(1);
  });

  xit("counts two questions for kanji", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 0,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions[0].questions).toBe(2);
  });

  xit("counts two questions for vocabulary", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 0,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions[0].questions).toBe(2);
  });

  xit("adds incorrect meanings to question count", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 3,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions[0].questions).toBe(5);
  });

  xit("adds incorrect readings to question count", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 3,
          incorrect_reading_answers: 3,
        },
      }),
    ]);
    const reviews = await getReviews();
    const sessions = parseSessions(reviews);
    expect(sessions[0].questions).toBe(8);
  });
});
