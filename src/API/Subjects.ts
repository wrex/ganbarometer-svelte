import type { Subject } from "./API";

declare var wkof: any;

let subjects: Subject[];
let subjectIndex;

export const getSubject = async (id: number): Promise<Subject> => {
  console.log(`retrieving subject ${id}`);
  if (!subjectIndex || !subjectIndex[id]) {
    wkof.include("ItemData");
    await wkof.ready("ItemData");
    subjects = await wkof.ItemData.get_items(); // retrieve all subjects
    subjectIndex = await wkof.ItemData.get_index(subjects);
  }
  return new Promise((r) => r(subjectIndex[id]));
};
