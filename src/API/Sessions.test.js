/*
 * @jest-environment jsdom
 */

// import { jest } from "@jest/globals";
import { getSessions, nDaysAgo } from "./Sessions";
import { wkApiFactory } from "../mocks/wanikaniApi";
import "fake-indexeddb/auto";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";
import { drop } from "@mswjs/data";

jest.useFakeTimers("modern");

const origIndexedDB = window.indexedDB;

beforeAll(() => {
  window.indexedDB = new FDBFactory(); // reset database
});

afterAll(() => {
  window.indexedDB = origIndexedDB;
});

describe("nDaysAgo()", () => {
  beforeAll(() => {
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });
  it("returns midnight three days ago when passed 3", () => {
    expect(nDaysAgo(3).toString()).toMatch(/^Wed Oct 02 2019 00:00:00/);
  });
  it("defaults to 0 days ago (midnight this a.m.)", () => {
    expect(nDaysAgo().toString()).toMatch(/^Sat Oct 05 2019 00:00:00/);
  });
});

describe("getSessions()", () => {
  const mockReview = (values) => {
    // const { subject, review, reviewData } = values;
    const subject = values?.subject ?? {};
    const review = values?.review ?? {};
    const reviewData = values?.reviewData ?? {};

    const mockSubject = wkApiFactory.subject.create({ ...subject });
    const mockData = wkApiFactory.reviewData.create({
      ...reviewData,
      subject_id: mockSubject.id,
    });
    return wkApiFactory.review.create({ ...review, data: mockData });
  };

  let wkofApiv2Mock = jest.fn();

  const mockReviewCollection = (reviews) => {
    return wkofApiv2Mock.mockReturnValue(
      wkApiFactory.reviewCollection.create({
        data: reviews,
        total_count: reviews.length,
      })
    );
  };

  beforeAll(() => {
    // Make all tests start at a known point in time
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
    window.wkof = {
      Apiv2: {
        fetch_endpoint: wkofApiv2Mock,
      },
    };
  });

  afterEach(() => {
    drop(wkApiFactory);
  });

  it("calls wkof.Apiv2.fetch_endpoint with 'reviews' as the first param", () => {
    mockReviewCollection([]);
    getSessions();
    expect(wkofApiv2Mock.mock.calls.length).toBe(1);
    expect(wkofApiv2Mock.mock.calls[0][0]).toEqual("reviews");
  });

  it("returns no session if no review fetched", () => {
    mockReviewCollection([]);
    const sessions = getSessions();
    expect(sessions.length).toBe(0);
  });

  it("returns one session if only one review fetched", () => {
    // reviews.mockReturnValue([wkApiFactory.review.create()]);
    mockReviewCollection([mockReview()]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
  });

  it("returns the number of reviews in the sessions object", () => {
    mockReviewCollection([mockReview()]);
    const sessions = getSessions();
    expect(sessions[0].reviews.length).toBe(1);
  });

  it("returns a duration of 30 seconds if only one review fetched", () => {
    mockReviewCollection([mockReview()]);
    const sessions = getSessions();
    expect(sessions[0].reviews.length).toBe(1);
    expect(
      sessions[0].endTime.getTime() - sessions[0].startTime.getTime()
    ).toBe(30000);
  });

  it("returns one session if two reviews together", () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:24:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:25:18.048Z" } }),
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
  });
  it("returns two sessions if two widely spaced reviews fetched", () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:24:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-05T04:25:18.048Z" } }),
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(2);
  });
  it("returns two sessions if string of 2 and 3 reviews", () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:01:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:02:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:01:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:02:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:03:00.000Z" } }),
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(2);
    expect(sessions[0].reviews.length).toBe(2);
    expect(sessions[1].reviews.length).toBe(3);
  });

  it("sets final review to median duration of prior reviews", () => {
    // median(1000, 2000, 3000, 4000, 5000, 30000) === 3000
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:00.000Z" } }), // 2s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:02.000Z" } }), // 1s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:03.000Z" } }), // 5s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:08.000Z" } }), // 4s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:12.000Z" } }), // 3s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:15.000Z" } }), // unknown (30s)
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
    expect(sessions[0].reviews.length).toBe(6);
    expect(sessions[0].reviews[5].duration).toBe(3000);
  });

  it("gets only counts one question for radicals", () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "123", object: "radical" },
      }),
    ]);
    const sessions = getSessions();
    expect(sessions[0].questions).toBe(1);
  });
});
