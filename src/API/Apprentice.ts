import { all } from "mathjs";
import type { ApprenticeCounts } from "./API";
import { getAllApprentice, getSubject, subjectIndex } from "./Subjects";

declare var wkof: any;

export const getApprenticeCounts = async (): Promise<ApprenticeCounts> => {
  const allApprentice = await getAllApprentice();
  const r = {
    radicals: [0, 0, 0, 0],
    kanji: [0, 0, 0, 0],
    vocabulary: [0, 0, 0, 0],
  };
  allApprentice.forEach((s) => {
    const srs_id = s.assignments.srs_stage;
    if (s.object === "radical") {
      r.radicals[srs_id - 1] += 1;
    } else if (s.object === "kanji") {
      r.kanji[srs_id - 1] += 1;
    } else if (s.object === "vocabulary") {
      r.vocabulary[srs_id - 1] += 1;
    } else {
      console.warn(`Unrecognized subject type ${s.object}`);
      console.warn(s);
    }
  });
  return r;
};
