import type { Subject } from "./API";

declare var wkof: any;

let subjects: Subject[];
let subjectIndex;

export const getSubject = async (id: number) => {
  if (!subjectIndex) {
    wkof.include("ItemData");
    await wkof.ready("ItemData");
    subjects = await wkof.ItemData.get_items(); // retrieve all subjects
    subjectIndex = await wkof.ItemData.get_index(subjects);
  }
  return subjectIndex[id];
};
