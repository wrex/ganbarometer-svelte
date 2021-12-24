import { jest } from "@jest/globals";
import { wkApiFactory } from "../mocks/wanikaniApi";
import { drop } from "@mswjs/data";

//
export const mockWkof = () => {
  window.wkof = {
    // Need to mock return values for Apiv2.fetch_endpoint()
    Apiv2: {
      fetch_endpoint: jest.fn(),
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
};

export const mockGetIndex = (subjects) => {
  window.wkof.ItemData.get_items.mockReturnValue(
    new Promise((r) => r(subjects))
  );
  let index = {};
  subjects.forEach((s) => {
    index[s.id] = s;
  });
  window.wkof.ItemData.get_index.mockReturnValue(new Promise((r) => r(index)));
};

// call like: mockreview({subject: {...}, review: {...}, reviewData: {...} })
export const mockReview = (values) => {
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

export const mockReviewCollection = (reviews) => {
  window.wkof.Apiv2.fetch_endpoint.mockReturnValue(
    wkApiFactory.reviewCollection.create({
      data: reviews,
      total_count: reviews.length,
    })
  );
  const subjects = wkApiFactory.subject.getAll();
  mockGetIndex(subjects);
};

export const clearMockedAPIData = () => drop(wkApiFactory);
