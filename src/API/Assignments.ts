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

  let newItems: Subject[];
  if (bySRS[1] && bySRS[2]) {
    newItems = [...bySRS[1], ...bySRS[2]];
  } else if (bySRS[1]) {
    newItems = [...bySRS[1]];
  }
  const newRadicals = newItems.filter((s) => s.object === "radical");
  const newKanji = newItems.filter((s) => s.object === "kanji");
  const newVocabulary = newItems.filter((s) => s.object === "vocabulary");

  const allStages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  let counts: number[] = [];
  allStages.forEach((stage) => {
    counts[stage] = bySRS[stage]?.length ?? 0;
  });

  //This list means that for each SRS level this is how many days it takes until
  //the item becomes available.
  //
  //For example: only 1/30 of master items are expected to be reviewed in any
  //given day
  //
  //Lessons & burns: 0 days (they are not accounted for)
  //Apprentice 1: 0.5 days (they come back as Apprentice 2 and will count as two
  //reviews)
  //
  // Rex's questions:
  //   1. Shouldn't appr1 be 0.167 and appr2 0.333?
  //
  //      No. After you complete a lesson, the item becomes A1 and will be
  //      available in 4 hours. Once you review the A1 item it comes back after
  //      8 hours, not 4. Then when you review it as A2 it comes back after 24
  //      hours. So even if you answer 100% correctly, you can only see an item
  //      twice in one day.
  //
  const srs_intervals = [0, 0.5, 1, 1, 2, 7, 14, 30, 120, 0];

  const reviewingStages = [1, 2, 3, 4, 5, 6, 7, 8];

  // First determine
  const expectedCount = reviewingStages
    .map((stage) => counts[stage] / srs_intervals[stage])
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
      early: counts[1] + counts[2],
      late: counts[3] + counts[4],
      total: counts[1] + counts[2] + counts[3] + counts[4],
    },
    lesson: counts[0],
    guru: counts[5] + counts[6],
    master: counts[7],
    enlightened: counts[8],
    burned: counts[9],
  };
};
