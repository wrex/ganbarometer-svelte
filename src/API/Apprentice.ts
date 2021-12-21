import type { ApprenticeCounts } from "./API";

declare var wkof: any;

export const getApprenticeCounts = async (): Promise<ApprenticeCounts> => {
  return {
    radicals: [1, 3, 0, 1],
    kanji: [3, 2, 2, 3],
    vocabulary: [8, 12, 32, 35],
  };
};
