/*
 * @jest-environment jsdom
 */

import { dayStartDaysAgo, fetchReviews } from "./ReviewCache";
import { jest } from "@jest/globals";
import { setupServer } from "msw/node";
import { rest } from "msw";

jest.useFakeTimers("modern");

describe("dayStartDaysAgo()", () => {
  beforeAll(() => {
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });
  it("returns midnight three days ago when passed 3", () => {
    expect(dayStartDaysAgo(3).toString()).toMatch(/^Wed Oct 02 2019 00:00:00/);
  });
  it("defaults to 0 days ago (midnight this a.m.)", () => {
    expect(dayStartDaysAgo().toString()).toMatch(/^Sat Oct 05 2019 00:00:00/);
  });
});

describe("fetchReviews()", () => {
  const params = {
    updated_after: 0,
  };
  const server = setupServer(
    rest.get("https://api.wanikani.com/v2/reviews", async (req, res, ctx) => {
      console.log(JSON.stringify(req.params));
      params.updated_after = req.url.searchParams.get("updated_after");
      return res(ctx.status(200));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });

  afterAll(() => {
    server.close();
  });

  it("requests reviews for past 3 days by default", async () => {
    const reviews = await fetchReviews("78ca70da-d268-4100-96ad-696014a53231");
    expect(params.updated_after).toEqual(
      new Date("Wed Oct 02 2019 00:00:00").toISOString()
    );
  });
});
