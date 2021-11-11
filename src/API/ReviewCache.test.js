/*
 * @jest-environment jsdom
 */

import { dayStartDaysAgo, fetchReviews } from "./ReviewCache";
import { jest } from "@jest/globals";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { wkApiFactory } from "../mocks/reviews";

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
      params.updated_after = req.url.searchParams.get("updated_after");
      return res(ctx.status(200));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
    server.resetHandlers();
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

  it("gets reviews for just the current day if passed 0", async () => {
    const reviews = await fetchReviews(
      "78ca70da-d268-4100-96ad-696014a53231",
      0
    );
    expect(params.updated_after).toEqual(
      new Date("Wed Oct 05 2019 00:00:00").toISOString()
    );
  });

  describe("cacheing behavior", () => {
    beforeAll(() => {
      // Generate 5 reviews with ids 101 - 105
      for (let i = 3; i > 0; i--) {
        wkApiFactory.review.create({
          id: 100 + i,
          url: `https://api.wanikani.com/v2/reviews/${100 + i}`,
        });
      }
    });
    fit("caches a single page of return values", async () => {
      server.use(
        rest.get("https://api.wanikani.com/v2/reviews", (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              object: "collection",
              total_count: wkApiFactory.review.count(),
              data_updated_at: "2021-11-09T18:20:55.375294Z",
              pages: {
                per_page: 1000,
                next_url: null,
                previous_url: null,
              },
              data: wkApiFactory.review.getAll(),
            })
          );
        })
      );
      const response = await fetchReviews(
        "78ca70da-d268-4100-96ad-696014a53231"
      );
      const reviews = response.data.data;
      expect(reviews.length).toBe(3);
      expect(response.data.total_count).toBe(reviews.length);
      const first = wkApiFactory.review.findFirst({
        where: {
          id: {
            equals: 101,
          },
        },
      });
      console.log(JSON.stringify(first, null, 2));
    });
    it.todo("caches each page of data if paginated");
    it.todo("returns cached values if present and nothing newer");
    it.todo("only retrieves newer values than what is cached");
    let totalCount;
    let pages;
    xit("gets both pages of results if server returns two", async () => {
      // server.use(
      //   rest.get(
      //     "https://api.wanikani.com/v2/reviews",
      //     async (req, res, ctx) => {
      //       const review = wkApiV2Factory.review.create();
      //       return res(
      //         ctx.status(200),
      //         ctx.json({
      //           total_count: 1,
      //           data: review,
      //         })
      //       );
      //     }
      //   )
      // );
      // const reviews = await fetchReviews(
      //   "78ca70da-d268-4100-96ad-696014a53231"
      // );

      // not implemented yet
      // expect(reviews.data.data).toBe(1);
      const review = wkApiFactory.review.create();
      // const review = wkApiV2Factory.review.create();
      expect(review).toEqual("foo");
    });
  });
});
