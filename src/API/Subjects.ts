import type { Subject } from "./API";

declare var wkof: any;

export let subjectIndex: Subject[];

export const getSubject = async (id: number): Promise<Subject> => {
  if (!subjectIndex || !subjectIndex[id]) {
    wkof.include("ItemData");
    await wkof.ready("ItemData");
    let subjects = await wkof.ItemData.get_items(); // retrieve all subjects
    subjectIndex = await wkof.ItemData.get_index(subjects, "subject_id");
  }
  return subjectIndex[id];
};

export const getAllApprentice = async (): Promise<Subject[]> => {
  wkof.include("ItemData");
  await wkof.ready("ItemData");
  return wkof.ItemData.get_items({
    wk_items: {
      filters: {
        level: "1..4",
      },
    },
  });
};
