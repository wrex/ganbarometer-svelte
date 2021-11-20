/*
 * @jest-environment jsdom
 */

import { jest } from "@jest/globals";
import { getSubject } from "./Subjects";
import { wkApiFactory } from "../mocks/wanikaniApi";
import "fake-indexeddb/auto";
import FDBFactory from "fake-indexeddb/lib/FDBFactory";

// window.wkof = {
//   include: jest.fn(),
//   ready: jest.fn(),
//   ItemData: {
//     get_items: jest.fn(),
//     get_index: jest.fn(),
//   },
// };

window.wkof = {};
window.wkof.include = jest.fn();
window.wkof.ready = jest.fn();
window.wkof.ItemData = {};
window.wkof.ItemData.get_items = jest.fn();
window.wkof.ItemData.get_index = jest.fn();

const mockSubjectIndex = (subjects) => {
  window.wkof.ItemData.get_items.mockReturnValue(
    new Promise((r) => r(subjects))
  );
  let index = {};
  subjects.forEach((s) => {
    index[s.id] = s;
  });
  window.wkof.ItemData.get_index.mockReturnValue(new Promise((r) => r(index)));
};

describe("getSubject()", () => {
  it("returns a subject with specified id", async () => {
    const mockSubject = wkApiFactory.subject.create({
      id: 101,
      object: "radical",
    });
    mockSubjectIndex([mockSubject]);
    const subject = await getSubject(101);
    expect(subject.id).toBe(101);
    expect(subject.object).toEqual("radical");
  });
});
