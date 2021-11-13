/*
 * @jest-environment jsdom
 */

// import { jest } from "@jest/globals";
import { getSessions } from "./Sessions";
import { wkApiFactory } from "../mocks/reviews";

jest.useFakeTimers("modern");

describe("getSessions()", () => {
  const origWkof = window.wkof;

  beforeAll(() => {
    // Make all tests start at a known point in time
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
    window.wkof = {
      Apiv2: {
        fetch_endpoint: jest.fn(),
      },
    };
  });

  afterEach(() => {
    wkApiFactory.review.deleteMany({ where: { id: { gte: 0 } } });
    // wkApiFactory.drop();
  });

  afterAll(() => {
    window.wkof = origWkof;
  });

  it("returns no session if no review fetched", () => {
    window.wkof.Apiv2.fetch_endpoint.mockReturnValue([]);
    const sessions = getSessions();
    expect(sessions.length).toBe(0);
  });

  it("returns one session if only one review fetched", () => {
    window.wkof.Apiv2.fetch_endpoint.mockReturnValue([
      wkApiFactory.review.create(),
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
  });

  it.todo("returns a duration of 600 seconds if only one review fetched");

  it("returns one session if two reviews together", () => {
    window.wkof.Apiv2.fetch_endpoint.mockReturnValue([
      wkApiFactory.review.create({ created_at: "2019-10-04T04:24:18.048Z" }),
      wkApiFactory.review.create({ created_at: "2019-10-04T04:25:18.048Z" }),
    ]);
    const sessions = getSessions();
    expect(sessions.length).toBe(1);
  });
  it.todo("returns two sessions if two widely spaced reviews fetched");
  it.todo("returns two sessions if string of 2 and 3 reviews");
});
