/*
 * @jest-environment jsdom
 */

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

let wkofApiv2Mock = jest.fn();

window.wkof = {
  // Need to mock return values for Apiv2.fetch_endpoint()
  Apiv2: {
    fetch_endpoint: wkofApiv2Mock,
  },
  // Need to mock return values for ItemData.get_items() and get_index()
  ItemData: {
    get_items: jest.fn(),
    get_index: jest.fn(),
  },
  file_cache: {
    dir: {},
    save: jest.fn(),
    load: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  },
  // Mock include to do nothing
  include: jest.fn(),
  // Ready returns a promise that just resolves
  ready: jest.fn(() => new Promise((r) => r())),
};

describe("getSessions()", () => {
  const mockGetIndex = (subjects) => {
    window.wkof.ItemData.get_items.mockReturnValue(
      new Promise((r) => r(subjects))
    );
    let index = {};
    subjects.forEach((s) => {
      index[s.id] = s;
    });
    window.wkof.ItemData.get_index.mockReturnValue(
      new Promise((r) => r(index))
    );
  };

  // call like: mockreview({subject: {...}, review: {...}, reviewData: {...} })
  const mockReview = (values) => {
    const subject = values?.subject ?? {};
    const review = values?.review ?? {};
    const reviewData = values?.reviewData ?? {};

    const mockSubject = wkApiFactory.subject.create({ ...subject });
    // mockGetIndex([mockSubject]);  // BUG!!!! need array of all subjects
    const mockData = wkApiFactory.reviewData.create({
      ...reviewData,
      subject_id: mockSubject.id,
    });
    return wkApiFactory.review.create({ ...review, data: mockData });
  };

  const mockReviewCollection = async (reviews) => {
    wkofApiv2Mock.mockReturnValue(
      wkApiFactory.reviewCollection.create({
        data: reviews,
        total_count: reviews.length,
      })
    );
    const subjects = wkApiFactory.subject.getAll();
    mockGetIndex(subjects);
  };

  beforeAll(() => {
    // Make all tests start at a known point in time
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });

  afterEach(() => {
    drop(wkApiFactory);
  });

  it("calls wkof.Apiv2.fetch_endpoint with 'reviews' as the first param", async () => {
    mockReviewCollection([]);
    await getSessions();
    expect(wkofApiv2Mock.mock.calls.length).toBe(1);
    expect(wkofApiv2Mock.mock.calls[0][0]).toEqual("reviews");
  });

  it("returns no session if no review fetched", async () => {
    mockReviewCollection([]);
    const sessions = await getSessions();
    expect(sessions.length).toBe(0);
  });

  it("returns one session if only one review fetched", async () => {
    mockReviewCollection([mockReview()]);
    const sessions = await getSessions();
    expect(sessions.length).toBe(1);
  });

  it("returns the number of reviews in the sessions object", async () => {
    mockReviewCollection([mockReview()]);
    const sessions = await getSessions();
    expect(sessions[0].reviews.length).toBe(1);
  });

  it("returns a duration of 0 seconds if only one review fetched", async () => {
    mockReviewCollection([mockReview()]);
    const sessions = await getSessions();
    expect(sessions[0].reviews.length).toBe(1);
    expect(
      sessions[0].endTime.getTime() - sessions[0].startTime.getTime()
    ).toBe(0);
  });

  it("returns one session if small number of reviews together (within 10 minutes)", async () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:24:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:25:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:26:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:27:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:28:18.048Z" } }),
    ]);
    const sessions = await getSessions();
    expect(sessions.length).toBe(1);
  });
  it("returns two sessions if two widely spaced reviews fetched", async () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:24:18.048Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-05T04:25:18.048Z" } }),
    ]);
    const sessions = await getSessions();
    expect(sessions.length).toBe(2);
  });
  it("returns two sessions if string of 2 and 3 reviews", async () => {
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T04:01:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T04:02:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:01:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:02:00.000Z" } }),
      mockReview({ reviewData: { created_at: "2019-10-04T05:03:00.000Z" } }),
    ]);
    const sessions = await getSessions();
    expect(sessions.length).toBe(2);
    expect(sessions[0].reviews.length).toBe(2);
    expect(sessions[1].reviews.length).toBe(3);
  });

  it("sets final review to median duration of prior reviews", async () => {
    // median(1000, 2000, 3000, 4000, 5000, 30000) === 3000
    mockReviewCollection([
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:00.000Z" } }), // 2s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:02.000Z" } }), // 1s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:03.000Z" } }), // 5s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:08.000Z" } }), // 4s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:12.000Z" } }), // 3s duration
      mockReview({ reviewData: { created_at: "2019-10-04T00:00:15.000Z" } }), // unknown (30s)
    ]);
    const sessions = await getSessions();
    console.log(JSON.stringify(sessions, null, 2));
    expect(sessions.length).toBe(1);
    expect(sessions[0].reviews.length).toBe(6);
    expect(sessions[0].reviews[5].duration).toBe(3000);
  });

  it("only counts one question for radicals", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "123", object: "radical" },
        reviewData: {
          incorrect_meaning_answers: 0,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const sessions = await getSessions();
    expect(sessions[0].questions).toBe(1);
  });

  it("counts two questions for kanji", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 0,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const sessions = await getSessions();
    expect(sessions[0].questions).toBe(2);
  });

  it("counts two questions for vocabulary", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 0,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const sessions = await getSessions();
    expect(sessions[0].questions).toBe(2);
  });

  it("adds incorrect meanings to question count", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 3,
          incorrect_reading_answers: 0,
        },
      }),
    ]);
    const sessions = await getSessions();
    expect(sessions[0].questions).toBe(5);
  });

  it("adds incorrect readings to question count", async () => {
    mockReviewCollection([
      mockReview({
        subject: { id: "101", object: "kanji" },
        reviewData: {
          incorrect_meaning_answers: 3,
          incorrect_reading_answers: 3,
        },
      }),
    ]);
    const sessions = await getSessions();
    expect(sessions[0].questions).toBe(8);
  });
});
