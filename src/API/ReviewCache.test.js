/*
 * @jest-environment jsdom
 */

import { dayStartDaysAgo, getReviews } from "./ReviewCache";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { settings } from "../store/stores";
import { jest } from "@jest/globals";

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

describe("getReviews()", () => {
  let requestBody = {};
  let requestHeaders = {};
  const server = setupServer(
    rest.get("https://api.wanikani.com/v2/reviews", (req, res, ctc) => {
      requestBody = req.body;
      requestHeaders = req.headers;
      return res(ctx.status(200));
    })
  );

  beforeAll(() => {
    settings.set({
      apiKey: "78ca70da-d268-4100-96ad-696014a53231",
    });
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  it("requests reviews for past 3 days by default", async () => {
    const reviews = await getReviews();
    expect(requestHeaders.updated_after).toMatch(/^Wed Oct 02 2019 00:00:00/);
  });
});
