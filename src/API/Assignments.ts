import type { Subject } from "./API";

declare var wkof: any;

export const getSrsCounts = async () => {
  wkof.include("ItemData");
  await wkof.ready("ItemData");

  const allItems: Subject[] = await wkof.ItemData.get_items(
    "subjects,assignments"
  );
  const bySRS: { [key: string]: Subject[] } = await wkof.ItemData.get_index(
    allItems,
    "srs_stage"
  );

  const newItems = [...bySRS[1], ...bySRS[2]];
  const newRadicals = newItems.filter((s) => s.object == "radicals");
  const newKanji = newItems.filter((s) => s.object == "kanji");
  const newVocabulary = newItems.filter((s) => s.object == "vocabulary");

  //This list means that for each SRS level this is how many days it takes until the item comes back
  //For example: only 1/30 of master items are expected to be reviewed in any given day
  //Notable figures
  //Lessons: 0 days (they are not accounted for)
  //Apprentice 1: 0.5 days (they come back as Apprentice 2 and will count as two reviews)
  //Burned: 0 days
  const srs_intervals = [0, 0.5, 1, 1, 2, 7, 14, 30, 120, 0];

  const reviewingStages = [1, 2, 3, 4, 5, 6, 7, 8];

  const expectedCount = reviewingStages
    .map((stage) => bySRS[stage].length / srs_intervals[stage])
    .reduce((acc, count) => (acc += count));

  return {
    expectedDaily: expectedCount,
    new: {
      radicals: newRadicals.length,
      kanji: newKanji.length,
      vocabulary: newVocabulary.length,
      total: newItems.length,
    },
    apprentice: {
      early: bySRS[1].length + bySRS[2].length,
      late: bySRS[3].length + bySRS[4].length,
      total:
        bySRS[1].length + bySRS[2].length + bySRS[3].length + bySRS[4].length,
    },
    lesson: bySRS[0].length,
    guru: bySRS[5].length + bySRS[6].length,
    master: bySRS[7].length,
    enlightened: bySRS[8].length,
    burned: bySRS[9].length,
  };
};
