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

  return {
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
