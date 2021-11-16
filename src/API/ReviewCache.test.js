/*
 * @jest-environment jsdom
 */

import { fetchReviews } from "./ReviewCache";
import { jest } from "@jest/globals";
import { wkApiFactory } from "../mocks/reviews";
import FDBFactory from "fake-indexeddb";

jest.useFakeTimers("modern");

describe("fetchReviews()", () => {
  beforeEach(() => {
    jest.setSystemTime(new Date("05 Oct 2019 01:02:03").getTime());
  });

  it.todo("returns cached values if present and nothing newer");
  it.todo("only retrieves newer values than what is cached");
});
