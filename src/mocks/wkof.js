import { jest } from "@jest/globals";
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
