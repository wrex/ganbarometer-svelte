/*
 * @jest-environment jsdom
 */

// import { jest } from "@jest/globals";
import { getSessions, nDaysAgo } from "./Sessions";
import { wkApiFactory } from "../mocks/reviews";
import "fake-indexeddb/auto";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";

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
  const origWkof = window.wkof;

  let reviews;
  beforeAll(() => {
    // Make all tests start at a known point in time
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
    window.wkof = {
      Apiv2: {
        fetch_endpoint: jest.fn(),
      },
    };
    reviews = window.wkof.Apiv2.fetch_endpoint;
  });

  afterEach(() => {
    wkApiFactory.review.deleteMany({ where: { id: { gte: 0 } } });
    // wkApiFactory.drop();
  });

  afterAll(() => {
    window.wkof = origWkof;
  });

  it("calls wkof.Apiv2.fetch_endpoint with 'reviews' as the first param", () => {
    reviews.mockReturnValue([]);
    getSessions();
    expect(reviews.mock.calls.length).toBe(1);
    expect(reviews.mock.calls[0][0]).toEqual("reviews");
  });

  it("returns no session if no review fetched", () => {
    reviews.mockReturnValue([]);
    const sessions = getSessions();
    expect(sessions.length).toBe(0);
  });

  it("returns one session if only one review fetched", () => {
    reviews.mockReturnValue([wkApiFactory.review.create()]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
  });

  it("returns the number of reviews in the sessions object", () => {
    reviews.mockReturnValue([wkApiFactory.review.create()]);
    const sessions = getSessions();
    expect(sessions[0].reviews.length).toBe(1);
  });

  it.todo("returns a duration of 600 seconds if only one review fetched");

  it("returns one session if two reviews together", () => {
    reviews.mockReturnValue([
      wkApiFactory.review.create({
        data_updated_at: "2019-10-04T04:24:18.048Z",
      }),
      wkApiFactory.review.create({
        data_updated_at: "2019-10-04T04:25:18.048Z",
      }),
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
  });
  it.todo("returns two sessions if two widely spaced reviews fetched");
  it.todo("returns two sessions if string of 2 and 3 reviews");
});
